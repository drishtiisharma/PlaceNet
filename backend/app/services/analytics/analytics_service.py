from sqlalchemy.orm import Session
from typing import Dict, Any
from collections import Counter

from app.database.models import HiringProfile, CandidateProfile

class AnalyticsService:
    @staticmethod
    def get_dashboard_analytics(db: Session) -> Dict[str, Any]:
        # Basic Counts
        total_resumes = db.query(CandidateProfile).count()
        total_hiring_profiles = db.query(HiringProfile).count()

        # Fetch all candidates for in-memory processing where SQLite struggles with JSON
        candidates = db.query(CandidateProfile).all()
        hiring_profiles = db.query(HiringProfile).all()

        # Average CGPA
        cgpa_list = []
        department_counts = Counter()
        skill_counts = Counter()
        cert_counts = Counter()
        exp_counts = Counter()
        trend_counts = Counter()

        for c in candidates:
            # CGPA parsing
            if c.cgpa:
                try:
                    # Strip out any non-numeric characters if possible, e.g. "8.5 / 10"
                    val = float(c.cgpa.split('/')[0].strip())
                    if 0 < val <= 10 or 0 < val <= 4: # basic sanity check
                        cgpa_list.append(val)
                except:
                    pass

            # Department
            if c.department:
                department_counts[c.department] += 1
            else:
                department_counts["Unknown"] += 1

            # Skills
            if isinstance(c.skills, list):
                for skill in c.skills:
                    skill_counts[skill.title() if isinstance(skill, str) else str(skill)] += 1

            # Certifications
            if isinstance(c.certifications, list):
                for cert in c.certifications:
                    cert_counts[cert.title() if isinstance(cert, str) else str(cert)] += 1

            # Experience (Roles count)
            roles = len(c.experience) if isinstance(c.experience, list) else 0
            exp_counts[f"{roles} Roles"] += 1

            # Upload Trends (by day)
            if c.created_at:
                day_str = c.created_at.strftime("%Y-%m-%d")
                trend_counts[day_str] += 1

        avg_cgpa = sum(cgpa_list) / len(cgpa_list) if cgpa_list else 0.0

        # Eligibility check
        eligibility = []
        total_shortlisted = set() # Unique candidates eligible for AT LEAST one profile

        for hp in hiring_profiles:
            eligible_count = 0
            req_cgpa = 0.0
            if hp.cgpa_requirement:
                try:
                    req_cgpa = float(hp.cgpa_requirement.split('/')[0].strip())
                except:
                    req_cgpa = 0.0

            req_depts = [d.lower().strip() for d in hp.eligible_departments] if isinstance(hp.eligible_departments, list) else []

            for c in candidates:
                # check dept
                dept_match = True
                if req_depts and c.department:
                    dept_match = c.department.lower().strip() in req_depts
                elif req_depts and not c.department:
                    dept_match = False

                # check cgpa
                cgpa_match = True
                if req_cgpa > 0 and c.cgpa:
                    try:
                        c_cg = float(c.cgpa.split('/')[0].strip())
                        if c_cg < req_cgpa:
                            cgpa_match = False
                    except:
                        cgpa_match = False
                elif req_cgpa > 0 and not c.cgpa:
                    cgpa_match = False

                if dept_match and cgpa_match:
                    eligible_count += 1
                    total_shortlisted.add(c.id)

            eligibility.append({
                "job_title": hp.job_title,
                "eligible_count": eligible_count
            })

        return {
            "total_resumes": total_resumes,
            "total_hiring_profiles": total_hiring_profiles,
            "average_cgpa": round(avg_cgpa, 2),
            "total_shortlisted": len(total_shortlisted),
            "department_distribution": [{"name": k, "value": v} for k, v in department_counts.most_common(10)],
            "top_skills": [{"name": k, "value": v} for k, v in skill_counts.most_common(10)],
            "certifications": [{"name": k, "value": v} for k, v in cert_counts.most_common(5)],
            "experience_distribution": [{"name": k, "value": v} for k, v in sorted(exp_counts.items())],
            "upload_trends": [{"date": k, "count": v} for k, v in sorted(trend_counts.items())],
            "eligibility_stats": eligibility
        }
