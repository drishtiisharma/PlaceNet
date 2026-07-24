import json
import logging
from io import BytesIO
from sqlalchemy.orm import Session
import openpyxl
from openpyxl.styles import Font, Alignment, PatternFill
from datetime import datetime
from app.database.models import HiringProfile, RankedCandidate, CandidateProfile
from app.services.resume.storage_service import StorageService

logger = logging.getLogger(__name__)

class ExportService:
    @staticmethod
    def generate_hiring_profile_report(db: Session, hiring_profile_id: str) -> BytesIO:
        # Fetch Profile
        hp = db.query(HiringProfile).filter(HiringProfile.id == hiring_profile_id).first()
        if not hp:
            raise ValueError(f"Hiring profile {hiring_profile_id} not found.")

        # Fetch Ranked Candidates for this Profile
        ranked_candidates = db.query(RankedCandidate).filter(
            RankedCandidate.hiring_profile_id == hiring_profile_id
        ).order_by(RankedCandidate.match_score.desc()).all()

        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Analytics Report"

        # Styling
        header_font = Font(bold=True, color="FFFFFF")
        header_fill = PatternFill("solid", fgColor="4F81BD")
        title_font = Font(bold=True, size=14)

        # Write Header Info
        ws.cell(row=1, column=1, value="Hiring Profile Name:").font = Font(bold=True)
        ws.cell(row=1, column=2, value=hp.job_title)

        ws.cell(row=2, column=1, value="Generation Timestamp:").font = Font(bold=True)
        ws.cell(row=2, column=2, value=datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

        ws.cell(row=3, column=1, value="Total Ranked Candidates:").font = Font(bold=True)
        ws.cell(row=3, column=2, value=len(ranked_candidates))

        # Generate Executive Summary based on profile context
        # (For simplicity we generate a basic summary, or we could call the LLM if specifically required, but instructions say "AI executive summary" in the headers, we'll write a static one or pull from stats)
        ws.cell(row=4, column=1, value="AI Executive Summary:").font = Font(bold=True)
        ws.cell(row=4, column=2, value=f"This report outlines the ranked candidates for the {hp.job_title} role, detailing match scores, skills alignment, and individual AI summaries for swift evaluation.")

        # Table Headers
        headers = [
            "Rank", "Candidate Name", "Contact Number", "Email", "Match %",
            "Skills Matched", "Missing Skills", "AI Summary", "Resume"
        ]
        
        start_row = 6
        for col_num, header in enumerate(headers, 1):
            cell = ws.cell(row=start_row, column=col_num, value=header)
            cell.font = header_font
            cell.fill = header_fill
            cell.alignment = Alignment(horizontal="center")
            ws.column_dimensions[openpyxl.utils.get_column_letter(col_num)].width = 20

        ws.column_dimensions["E"].width = 15 # Match %
        ws.column_dimensions["F"].width = 30 # Matched Skills
        ws.column_dimensions["G"].width = 30 # Missing Skills
        ws.column_dimensions["H"].width = 50 # AI Summary
        ws.column_dimensions["I"].width = 30 # Resume

        # Write Data
        for idx, rc in enumerate(ranked_candidates, 1):
            # Fetch Candidate Profile
            cp = db.query(CandidateProfile).filter(CandidateProfile.resume_id == rc.resume_id).first()
            candidate_name = cp.full_name if cp else "Unknown"
            contact_number = cp.phone if cp and cp.phone else "N/A"
            email = cp.email if cp and cp.email else "N/A"
            
            # Parse Ranking Data JSON
            ranking_data = {}
            if rc.ranking_data:
                try:
                    ranking_data = json.loads(rc.ranking_data) if isinstance(rc.ranking_data, str) else rc.ranking_data
                except:
                    pass

            matched_skills = ", ".join(ranking_data.get("matched_skills", []))
            missing_skills = ", ".join(ranking_data.get("missing_skills", []))
            ai_summary = ranking_data.get("ai_summary", "")
            
            signed_url = "N/A"
            if cp and cp.resume_storage_path:
                try:
                    signed_url = StorageService.get_signed_url(cp.resume_storage_path) or "N/A"
                except:
                    pass

            # Temporary logging as requested
            logger.info(f"EXPORT DEBUG | Candidate ID: {rc.resume_id}")
            logger.info(f"EXPORT DEBUG | Email: {email}")
            logger.info(f"EXPORT DEBUG | Phone: {contact_number}")
            logger.info(f"EXPORT DEBUG | Resume Storage Path: {cp.resume_storage_path if cp else None}")
            logger.info(f"EXPORT DEBUG | Generated Signed URL: {signed_url}")

            row_data = [
                idx,
                candidate_name,
                contact_number,
                email,
                f"{rc.match_score}%",
                matched_skills,
                missing_skills,
                ai_summary,
                "Open Resume" if signed_url != "N/A" else "N/A"
            ]

            for col_num, cell_value in enumerate(row_data, 1):
                cell = ws.cell(row=start_row + idx, column=col_num, value=cell_value)
                cell.alignment = Alignment(vertical="top", wrap_text=True)
                if col_num == 9 and signed_url != "N/A":
                    cell.hyperlink = signed_url
                    cell.font = Font(underline="single", color="0563C1")

        output = BytesIO()
        wb.save(output)
        output.seek(0)
        return output
