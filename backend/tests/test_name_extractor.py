import pytest
from app.services.resume.name_extractor import NameExtractor

def test_filename_extraction():
    assert NameExtractor._clean_filename("Drishti_Sharma_Resume.pdf") == "Drishti Sharma"
    assert NameExtractor._clean_filename("keerti_resume.pdf") == "Keerti"
    assert NameExtractor._clean_filename("VineethChivukula_CV.pdf") == "Vineeth Chivukula"
    assert NameExtractor._clean_filename("Sneha_Gupta_Final_ATS_2023.docx") == "Sneha Gupta"
    assert NameExtractor._clean_filename("Shubham_Patel_v2.pdf") == "Shubham Patel"

def test_exclusions():
    assert NameExtractor._is_valid_name("Java") == False
    assert NameExtractor._is_valid_name("Madhya Pradesh") == False
    assert NameExtractor._is_valid_name("Objective") == False
    assert NameExtractor._is_valid_name("Shourya Singh Ranawat") == True
    assert NameExtractor._is_valid_name("Sanjana Singh") == True
    assert NameExtractor._is_valid_name("Samiksha") == True

def test_full_extraction_from_text():
    text1 = "Resume\nSonali Rathore\nB.Tech Computer Science\nSkills: Java, Python"
    assert NameExtractor.extract(text1, "unknown_file.pdf") == "Sonali Rathore"

    text2 = "Vineeth Chivukula\nEmail: vineeth@example.com\nExperience\nSoftware Engineer"
    assert NameExtractor.extract(text2, "vineeth.pdf") == "Vineeth Chivukula"
    
    text3 = "Sneha Gupta\nLocation: India\nSkills: HTML, CSS, React\n"
    assert NameExtractor.extract(text3, "Sneha_Gupta_Resume.pdf") == "Sneha Gupta"

def test_hard_exclusions():
    text = "Java\nPython\nReact\nNode\nMachine Learning"
    assert NameExtractor.extract(text, "resume.pdf") == "Unknown Candidate"
