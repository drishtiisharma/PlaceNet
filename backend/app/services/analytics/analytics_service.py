import json
import logging
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Dict, Any, List
from collections import Counter

from app.database.models import HiringProfile, CandidateProfile, RankedCandidate
from app.ai.client import llm_service

logger = logging.getLogger(__name__)

class AnalyticsService:
    @staticmethod
    def get_dashboard_analytics(db: Session, user_id: str) -> Dict[str, Any]:
        # SQL Aggregations
        # Basic Counts
        total_resumes = db.query(CandidateProfile).filter(CandidateProfile.user_id == user_id).count()
        total_hiring_profiles = db.query(HiringProfile).filter(HiringProfile.user_id == user_id).count()
        hiring_profiles_all = db.query(HiringProfile).filter(HiringProfile.user_id == user_id).all()
        hiring_profiles_list = [{"id": hp.id, "title": hp.job_title} for hp in hiring_profiles_all]

        # Parsing Failed & Successfully Parsed
        parsing_failed = db.query(CandidateProfile).filter(
            CandidateProfile.user_id == user_id,
            ((CandidateProfile.full_name.is_(None)) | (CandidateProfile.full_name == ''))
        ).count()
        successfully_parsed = total_resumes - parsing_failed

        # Missing Projects & Missing GitHub
        missing_projects_res = db.execute(text(
            f"SELECT COUNT(*) FROM candidate_profiles WHERE (projects IS NULL OR json_extract(projects, '$') IS NULL OR json_array_length(projects) = 0) AND user_id = '{user_id}' AND full_name IS NOT NULL AND full_name != ''"
        )).scalar()

        missing_github_res = db.execute(text(
            f"SELECT COUNT(*) FROM candidate_profiles WHERE (projects IS NULL OR projects NOT LIKE '%github.com%') AND (experience IS NULL OR experience NOT LIKE '%github.com%') AND user_id = '{user_id}' AND full_name IS NOT NULL AND full_name != ''"
        )).scalar()
        
        # Hiring Profile Analytics (from RankedCandidate)
        ranked_stats = db.execute(text(
            f"SELECT AVG(match_score) as avg, MAX(match_score) as max, MIN(match_score) as min, COUNT(*) as count FROM ranked_candidates WHERE user_id = '{user_id}'"
        )).fetchone()
        
        avg_match = round(ranked_stats.avg, 2) if ranked_stats and ranked_stats.avg else 0.0
        highest_match = ranked_stats.max if ranked_stats and ranked_stats.max else 0
        lowest_match = ranked_stats.min if ranked_stats and ranked_stats.min else 0
        candidates_ranked = ranked_stats.count if ranked_stats and ranked_stats.count else 0
        
        # Resume Quality = avg_match for simplicity as proposed in the plan
        average_resume_quality = avg_match
        
        # Quality/Match Distribution
        count_gt_80 = db.execute(text(f"SELECT COUNT(*) FROM ranked_candidates WHERE match_score >= 80 AND user_id = '{user_id}'")).scalar() or 0
        count_60_79 = db.execute(text(f"SELECT COUNT(*) FROM ranked_candidates WHERE match_score >= 60 AND match_score < 80 AND user_id = '{user_id}'")).scalar() or 0
        count_40_59 = db.execute(text(f"SELECT COUNT(*) FROM ranked_candidates WHERE match_score >= 40 AND match_score < 60 AND user_id = '{user_id}'")).scalar() or 0
        count_lt_40 = db.execute(text(f"SELECT COUNT(*) FROM ranked_candidates WHERE match_score < 40 AND user_id = '{user_id}'")).scalar() or 0
        
        resume_quality_distribution = [
            {"name": "0-39 (Needs Improvement)", "value": count_lt_40},
            {"name": "40-59 (Average)", "value": count_40_59},
            {"name": "60-79 (Good)", "value": count_60_79},
            {"name": "80-100 (Excellent)", "value": count_gt_80}
        ]

        # Top Skills & Categories
        skill_counts = Counter()
        try:
            # Try using json_each if available
            skills_res = db.execute(text(f"SELECT value FROM candidate_profiles, json_each(skills) WHERE user_id = '{user_id}'")).fetchall()
            for row in skills_res:
                skill_counts[row[0].title()] += 1
        except Exception as e:
            # Fallback if json_each is not supported
            logger.warning(f"Failed to use json_each: {e}. Falling back to in-memory JSON parsing.")
            candidates = db.query(CandidateProfile.skills).filter(CandidateProfile.user_id == user_id).all()
            for c in candidates:
                if isinstance(c.skills, list):
                    for skill in c.skills:
                        skill_counts[skill.title() if isinstance(skill, str) else str(skill)] += 1
                elif isinstance(c.skills, str):
                    try:
                        skills = json.loads(c.skills)
                        for skill in skills:
                            skill_counts[skill.title()] += 1
                    except:
                        pass
                        
        total_skills_count = sum(skill_counts.values()) or 1
        top_skills = [{"name": k, "value": v, "percentage": round((v / total_skills_count) * 100, 1)} for k, v in skill_counts.most_common(10)]
        all_skills = [{"name": k, "value": v, "percentage": round((v / total_skills_count) * 100, 1)} for k, v in skill_counts.most_common()]
        
        # Group Skills by Categories
        categories = {
            "Programming": ["Python", "Java", "C++", "C", "Javascript", "Typescript", "Go", "Rust", "Swift"],
            "Frontend": ["React", "Angular", "Vue", "Html", "Css", "Next.js"],
            "Backend": ["Node.js", "Django", "Flask", "Spring", "Express"],
            "AI/ML": ["Machine Learning", "Deep Learning", "Tensorflow", "Pytorch", "Nlp"],
            "Cloud & DevOps": ["Aws", "Azure", "Gcp", "Docker", "Kubernetes", "Jenkins", "Git"],
            "Database": ["Sql", "Mysql", "Postgresql", "Mongodb", "Redis"]
        }
        
        category_counts = {cat: 0 for cat in categories}
        category_counts["Other"] = 0
        
        for skill, count in skill_counts.items():
            found = False
            for cat, keywords in categories.items():
                if any(kw.lower() in skill.lower() for kw in keywords):
                    category_counts[cat] += count
                    found = True
                    break
            if not found:
                category_counts["Other"] += count
                
        skills_categories = [{"name": k, "value": v} for k, v in category_counts.items() if v > 0]
        
        # Other existing metrics for backward compatibility
        department_counts = Counter()
        cert_counts = Counter()
        exp_counts = Counter()
        trend_counts = Counter()
        avg_cgpa_list = []
        
        all_candidates = db.query(CandidateProfile).filter(CandidateProfile.user_id == user_id).all()
        for c in all_candidates:
            if c.cgpa:
                try:
                    val = float(c.cgpa.split('/')[0].strip())
                    if 0 < val <= 10 or 0 < val <= 4:
                        avg_cgpa_list.append(val)
                except: pass
            
            dept = c.department if c.department else "Unknown"
            department_counts[dept] += 1
            
            roles = len(c.experience) if isinstance(c.experience, list) else 0
            exp_counts[f"{roles} Roles"] += 1
            
            if c.created_at:
                trend_counts[c.created_at.strftime("%Y-%m-%d")] += 1
                
        avg_cgpa = sum(avg_cgpa_list) / len(avg_cgpa_list) if avg_cgpa_list else 0.0
        
        stats = {
            "total_resumes": total_resumes,
            "successfully_parsed": successfully_parsed,
            "parsing_failed": parsing_failed,
            "total_hiring_profiles": total_hiring_profiles,
            "hiring_profiles_list": hiring_profiles_list,
            "average_resume_quality": average_resume_quality,
            "resume_quality_distribution": resume_quality_distribution,
            "top_skills": top_skills,
            "all_skills": all_skills,
            "skills_categories": skills_categories,
            "hiring_profile_analytics": {
                "candidates_ranked": candidates_ranked,
                "average_match": avg_match,
                "highest_match": highest_match,
                "lowest_match": lowest_match,
                "count_gt_80": count_gt_80,
                "count_50_80": count_60_79 + count_40_59, # using old keys for compatibility if needed, or recalculate:
                "count_lt_50": count_lt_40 # wait, 50-80 and <50 are specifically requested in Hiring Profile Analytics, I'll recalculate
            },
            "action_required": {
                "missing_contact": 0, # Placeholder per user discussion
                "missing_github": missing_github_res or 0,
                "missing_projects": missing_projects_res or 0,
                "parsing_failures": parsing_failed,
                "below_50_match": db.execute(text(f"SELECT COUNT(*) FROM ranked_candidates WHERE match_score < 50 AND user_id = '{user_id}'")).scalar() or 0
            },
            # Backward compatibility fields
            "average_cgpa": round(avg_cgpa, 2),
            "total_shortlisted": count_gt_80 + count_60_79 + count_40_59,
            "department_distribution": [{"name": k, "value": v} for k, v in department_counts.most_common(10)],
            "upload_trends": [{"date": k, "count": v} for k, v in sorted(trend_counts.items())]
        }
        
        # fix the 50-80 specific counts for hiring profile analytics
        count_50_80_strict = db.execute(text(f"SELECT COUNT(*) FROM ranked_candidates WHERE match_score >= 50 AND match_score < 80 AND user_id = '{user_id}'")).scalar() or 0
        count_lt_50_strict = db.execute(text(f"SELECT COUNT(*) FROM ranked_candidates WHERE match_score < 50 AND user_id = '{user_id}'")).scalar() or 0
        stats["hiring_profile_analytics"]["count_50_80"] = count_50_80_strict
        stats["hiring_profile_analytics"]["count_lt_50"] = count_lt_50_strict
        
        # Generate AI Insights
        try:
            stats["ai_insights"] = AnalyticsService.generate_ai_insights(stats)
        except Exception as e:
            logger.error(f"Failed to generate AI insights: {e}")
            stats["ai_insights"] = ["Unable to generate insights at this time."]
            
        return stats

    @staticmethod
    def generate_ai_insights(stats: Dict[str, Any]) -> List[str]:
        prompt = f"""
You are an expert technical recruiter analyzing an applicant tracking database.
Here are the current aggregated statistics of the candidates:

Total Resumes: {stats['total_resumes']}
Successfully Parsed: {stats['successfully_parsed']}
Parsing Failed: {stats['parsing_failed']}
Average Resume Quality Match Score: {stats['average_resume_quality']}%
Quality Distribution: {stats['resume_quality_distribution']}
Top Skills: {stats['top_skills']}
Skills by Category: {stats['skills_categories']}
Hiring Profile Stats - Avg Match: {stats['hiring_profile_analytics']['average_match']}%, High: {stats['hiring_profile_analytics']['highest_match']}%, Low: {stats['hiring_profile_analytics']['lowest_match']}%

Actionable items:
- Missing GitHub: {stats['action_required']['missing_github']}
- Missing Projects: {stats['action_required']['missing_projects']}
- Candidates Below 50% Match: {stats['action_required']['below_50_match']}

Provide 5-8 concise, actionable recruiter observations or insights based solely on these statistics. 
Format as a bulleted list using the '-' character. 
Do not include any introductory or concluding text, just the bullet points.
"""
        response = llm_service.chat_completion(
            messages=[
                {"role": "system", "content": "You are a helpful recruitment analyst."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=300
        )
        
        content = response.choices[0].message.content.strip()
        insights = [line.strip().lstrip('-').lstrip('*').strip() for line in content.split('\n') if line.strip().startswith('-') or line.strip().startswith('*')]
        
        if not insights:
            # Fallback if the LLM didn't use bullets
            insights = [line.strip() for line in content.split('\n') if line.strip()]
            
        return insights[:8]
