#!/usr/bin/env python3
"""
Generate comprehensive keywords database for resume parsing.

Combines:
- Technical skills from skills.csv (filtered)
- Business/domain keywords
- Tools and technologies
- Soft skills
- Certifications
"""

import csv
import re
import os
from pathlib import Path
from typing import Set, List

# Business and Domain Keywords
BUSINESS_KEYWORDS = [
    # Sales & Business Development
    "Sales", "Business Development", "Account Management", "Account Sales", "Account Portfolio Management",
    "Consultative Selling", "Solution Selling", "B2B Sales", "B2C Sales", "Inside Sales", "Outside Sales",
    "Enterprise Sales", "SMB Sales", "Channel Sales", "Partner Sales", "Direct Sales", "Indirect Sales",
    "Sales Strategy", "Sales Planning", "Sales Forecasting", "Sales Operations", "Sales Enablement",
    "Lead Generation", "Lead Qualification", "Prospecting", "Cold Calling", "Warm Calling",
    "Customer Acquisition", "Customer Retention", "Customer Success", "Customer Relationship Management",
    "Revenue Generation", "Revenue Growth", "Revenue Management", "Pipeline Management",
    
    # CRM & Sales Tools
    "CRM", "Salesforce CRM", "Salesforce", "HubSpot", "Microsoft Dynamics", "Zoho CRM", "Pipedrive",
    "Salesforce Service Cloud", "Salesforce Sales Cloud", "Salesforce Marketing Cloud",
    "Salesforce Experience Cloud", "Salesforce Knowledge", "Apex", "Lightning Components",
    "Visualforce", "Salesforce Administration", "Salesforce Development",
    
    # Marketing
    "Digital Marketing", "Content Marketing", "Social Media Marketing", "Email Marketing",
    "Search Engine Marketing", "SEM", "Search Engine Optimization", "SEO",
    "Pay-Per-Click", "PPC", "Google Ads", "Facebook Ads", "LinkedIn Ads",
    "Marketing Automation", "Marketing Analytics", "Marketing Strategy",
    
    # Project & Program Management
    "Project Management", "Program Management", "Portfolio Management", "Agile Project Management",
    "Scrum", "Kanban", "Waterfall", "PMO", "Project Office",
    "Project Planning", "Project Execution", "Project Control", "Project Coordination",
    "Stakeholder Management", "Stakeholder Engagement", "Stakeholder Communication",
    "Change Management", "Risk Management", "Issue Management", "Resource Management",
    "Budget Management", "Cost Management", "Schedule Management", "Quality Management",
    "Scope Management", "Vendor Management", "Contract Management",
    
    # Business Analysis
    "Business Analysis", "Business Analytics", "Data Analysis", "Financial Analysis",
    "Market Analysis", "Competitive Analysis", "SWOT Analysis", "Gap Analysis",
    "Root Cause Analysis", "RCA", "Process Analysis", "Requirements Analysis",
    "Functional Analysis", "Technical Analysis", "Performance Analysis",
    
    # Operations
    "Operations Management", "Business Operations", "Operations Excellence",
    "Process Improvement", "Process Optimization", "Process Mapping", "Process Design",
    "Workflow Management", "Supply Chain Management", "Logistics Management",
    "Inventory Management", "Vendor Relations", "Supplier Management",
    
    # Finance & Accounting
    "Financial Management", "Financial Planning", "Financial Analysis", "Financial Reporting",
    "Budgeting", "Forecasting", "Financial Modeling", "Accounting", "Bookkeeping",
    "Accounts Payable", "Accounts Receivable", "AR Management", "AP Management",
    "Cash Management", "Treasury Management", "Liquidity Management",
    "Financial Controls", "Internal Controls", "Audit", "Compliance",
    
    # Human Resources
    "Human Resources", "HR", "Talent Acquisition", "Recruiting", "Talent Management",
    "Performance Management", "Employee Relations", "Compensation", "Benefits",
    "HRIS", "HR Analytics", "Workforce Planning", "Succession Planning",
    
    # Strategy & Consulting
    "Business Strategy", "Corporate Strategy", "Strategic Planning", "Strategic Analysis",
    "Management Consulting", "Business Consulting", "Strategy Consulting",
    "Market Research", "Market Intelligence", "Competitive Intelligence",
    
    # Communication & Collaboration
    "Communication", "Written Communication", "Verbal Communication", "Presentation Skills",
    "Public Speaking", "Client Communication", "Cross-functional Collaboration",
    "Team Collaboration", "Stakeholder Communication", "Executive Communication",
    
    # Leadership & Management
    "Leadership", "Team Leadership", "People Management", "Team Management",
    "Team Building", "Mentoring", "Coaching", "Training", "Development",
    "Conflict Resolution", "Conflict Management", "Negotiation", "Influence",
    "Decision Making", "Problem Solving", "Critical Thinking", "Strategic Thinking",
]

# Tools & Technologies (beyond technical)
TOOLS_KEYWORDS = [
    # Office Productivity
    "Excel", "Microsoft Excel", "Advanced Excel", "Excel VBA", "Excel Macros",
    "MS Office", "Microsoft Office", "Office 365", "Microsoft 365",
    "Word", "PowerPoint", "Outlook", "Access", "SharePoint", "OneDrive",
    "Google Workspace", "Google Docs", "Google Sheets", "Google Slides",
    "Google Colab", "Google Analytics", "Google Ads", "Google Search Console",
    
    # Business Intelligence & Analytics
    "Tableau", "Power BI", "Microsoft Power BI", "Qlik", "QlikView", "QlikSense",
    "Looker", "Sisense", "MicroStrategy", "SAP Analytics Cloud",
    "Business Objects", "Cognos", "Hyperion", "Oracle BI",
    
    # Data & Analytics Tools
    "SQL", "MySQL", "PostgreSQL", "Oracle", "SQL Server", "MongoDB", "Redis",
    "Python", "R", "SAS", "SPSS", "Stata", "MATLAB",
    "Jupyter", "Jupyter Notebook", "Google Colab", "Databricks",
    "Apache Spark", "Hadoop", "Snowflake", "BigQuery", "Redshift",
    
    # Project Management Tools
    "Jira", "Confluence", "Asana", "Trello", "Monday.com", "Smartsheet",
    "Microsoft Project", "Project", "Primavera", "Clarizen",
    "ServiceNow", "Remedy", "Cherwell",
    
    # CRM & Sales Tools
    "Salesforce", "HubSpot", "Microsoft Dynamics", "Zoho CRM", "Pipedrive",
    "Salesforce CPQ", "Salesforce Pardot", "Salesforce Commerce Cloud",
    
    # Communication & Collaboration
    "Slack", "Microsoft Teams", "Zoom", "WebEx", "Skype",
    "SharePoint", "Confluence", "Notion", "Airtable",
    
    # Design & Creative
    "Adobe Creative Suite", "Photoshop", "Illustrator", "InDesign", "Premiere Pro",
    "Figma", "Sketch", "Adobe XD", "Canva",
    
    # ERP & Enterprise
    "SAP", "Oracle ERP", "Microsoft Dynamics", "NetSuite", "Workday",
    "PeopleSoft", "JD Edwards", "Infor",
]

# Soft Skills
SOFT_SKILLS = [
    "Leadership", "Team Leadership", "People Management", "Team Management",
    "Communication", "Written Communication", "Verbal Communication", "Presentation",
    "Public Speaking", "Interpersonal Skills", "Relationship Building",
    "Collaboration", "Teamwork", "Cross-functional Collaboration",
    "Problem Solving", "Critical Thinking", "Analytical Thinking", "Strategic Thinking",
    "Decision Making", "Judgment", "Reasoning",
    "Adaptability", "Flexibility", "Agility", "Resilience",
    "Time Management", "Organization", "Prioritization", "Multitasking",
    "Attention to Detail", "Accuracy", "Quality Focus",
    "Initiative", "Proactive", "Self-motivated", "Driven",
    "Creativity", "Innovation", "Innovative Thinking",
    "Negotiation", "Influence", "Persuasion",
    "Conflict Resolution", "Conflict Management", "Mediation",
    "Mentoring", "Coaching", "Training", "Teaching",
    "Customer Focus", "Client Focus", "Customer Service", "Client Service",
    "Stakeholder Management", "Stakeholder Engagement",
    "Emotional Intelligence", "EQ", "Empathy",
    "Cultural Awareness", "Diversity", "Inclusion",
]

# Certifications
CERTIFICATIONS = [
    # Project Management
    "PMP", "Project Management Professional", "PMI", "PMI-PMP",
    "CAPM", "Certified Associate in Project Management",
    "PRINCE2", "PRINCE2 Foundation", "PRINCE2 Practitioner",
    "Agile", "CSM", "Certified ScrumMaster", "CSPO", "Certified Scrum Product Owner",
    "SAFe", "Scaled Agile Framework", "SAFe Agilist", "SAFe Product Owner",
    
    # Quality & Process
    "Six Sigma", "Six Sigma Green Belt", "Six Sigma Black Belt", "Six Sigma Master Black Belt",
    "Lean", "Lean Six Sigma", "Lean Manufacturing",
    "ISO 9001", "ISO 27001", "ISO 20000", "ISO 14001",
    
    # IT & Technology
    "ITIL", "ITIL Foundation", "ITIL Practitioner", "ITIL Expert",
    "AWS Certified", "AWS Solutions Architect", "AWS Developer", "AWS SysOps",
    "Azure Certified", "Microsoft Azure", "Azure Administrator", "Azure Developer",
    "Google Cloud", "GCP Certified", "Google Cloud Architect",
    "Salesforce Certified", "Salesforce Administrator", "Salesforce Developer",
    "Cisco", "CCNA", "CCNP", "CCIE",
    "CompTIA", "A+", "Network+", "Security+",
    
    # Data & Analytics
    "Tableau Certified", "Tableau Desktop Specialist", "Tableau Server Certified",
    "Power BI", "Microsoft Power BI",
    "SAS Certified", "SAS Base", "SAS Advanced",
    
    # Business & Finance
    "CPA", "Certified Public Accountant",
    "CFA", "Chartered Financial Analyst",
    "CMA", "Certified Management Accountant",
    "FRM", "Financial Risk Manager",
    
    # HR
    "SHRM", "SHRM-CP", "SHRM-SCP",
    "PHR", "Professional in Human Resources",
    "SPHR", "Senior Professional in Human Resources",
]

# Domain-Specific Terms
DOMAIN_KEYWORDS = [
    # Banking & Finance
    "Banking", "Retail Banking", "Commercial Banking", "Investment Banking",
    "Corporate Banking", "Private Banking", "Wealth Management",
    "Treasury", "Treasury Operations", "Treasury Management",
    "Trade Finance", "Supply Chain Finance", "Cash Management",
    "Payment Processing", "Payment Gateway", "Payment Systems",
    "Core Banking", "Digital Banking", "Mobile Banking", "Online Banking",
    "KYC", "Know Your Customer", "AML", "Anti-Money Laundering",
    "Compliance", "Regulatory Compliance", "Risk Management", "Credit Risk",
    "Market Risk", "Operational Risk", "Fraud Detection", "Fraud Prevention",
    
    # Healthcare
    "Healthcare", "Healthcare Management", "Healthcare Administration",
    "HIPAA", "HL7", "Electronic Health Records", "EHR", "EMR",
    "Clinical", "Clinical Operations", "Clinical Research",
    
    # Retail & E-commerce
    "Retail", "E-commerce", "Ecommerce", "Online Retail",
    "Supply Chain", "Logistics", "Inventory Management",
    "Merchandising", "Category Management",
    
    # Manufacturing
    "Manufacturing", "Production", "Operations", "Quality Control",
    "Lean Manufacturing", "Six Sigma", "Continuous Improvement",
]

def is_version_number(text: str) -> bool:
    """Check if text looks like a version number"""
    # Patterns like "1.0", "2.3.4", "v1.0", "0.10.24"
    version_patterns = [
        r'^\d+\.\d+',  # Starts with number.number
        r'^v?\d+\.\d+\.\d+',  # v1.2.3 or 1.2.3
        r'^\d+\.x$',  # 1.x
        r'^0\.\d+',  # 0.10, 0.24
    ]
    for pattern in version_patterns:
        if re.match(pattern, text, re.IGNORECASE):
            return True
    return False

def is_noise(text: str) -> bool:
    """Check if text is noise (not a meaningful keyword)"""
    text_lower = text.lower().strip()
    
    # Very short
    if len(text_lower) <= 1:
        return True
    
    # Version numbers
    if is_version_number(text_lower):
        return True
    
    # Single characters or numbers
    if len(text_lower) == 1 and (text_lower.isdigit() or text_lower.isalpha()):
        return True
    
    # Common noise patterns
    noise_patterns = [
        r'^\.\w+$',  # .com, .net, .htaccess
        r'^\d+$',  # Pure numbers
        r'^[a-z]$',  # Single letter
    ]
    for pattern in noise_patterns:
        if re.match(pattern, text_lower):
            return True
    
    return False

def load_technical_skills_from_csv(csv_path: str) -> Set[str]:
    """Load and filter technical skills from skills.csv"""
    skills = set()
    
    if not os.path.exists(csv_path):
        print(f"Warning: {csv_path} not found, skipping technical skills")
        return skills
    
    print(f"Loading technical skills from {csv_path}...")
    with open(csv_path, 'r', encoding='utf-8', errors='ignore') as f:
        reader = csv.DictReader(f)
        for row in reader:
            skill = row.get('Skill', '').strip()
            if skill:
                # Clean up
                skill = skill.replace('"', '').replace('\n', ' ').strip()
                
                # Filter out noise
                if not is_noise(skill) and len(skill) > 1:
                    skills.add(skill)
    
    print(f"Loaded {len(skills)} technical skills (after filtering)")
    return skills

def extract_tools_from_tech_patterns() -> Set[str]:
    """Extract tool/technology names from TECH_PATTERNS in main.py"""
    # We'll manually list the key ones since importing would be complex
    tools = {
        # Programming Languages
        "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", ".NET", "Go", "Rust",
        "Kotlin", "Swift", "Scala", "Ruby", "PHP", "R",
        
        # Frameworks
        "React", "Angular", "Vue.js", "Node.js", "Next.js", "Django", "Flask", "FastAPI",
        "Spring Boot", "Express.js", "Laravel", "Rails",
        
        # Databases
        "PostgreSQL", "MySQL", "MongoDB", "Redis", "Oracle", "SQL Server", "SQL",
        "NoSQL", "Cassandra", "Elasticsearch",
        
        # Cloud
        "AWS", "Amazon Web Services", "Azure", "GCP", "Google Cloud",
        "EC2", "S3", "Lambda", "DynamoDB", "RDS",
        
        # DevOps
        "Docker", "Kubernetes", "Terraform", "Jenkins", "Git", "GitHub", "GitLab",
        "CI/CD", "Ansible", "Puppet", "Chef",
        
        # Data Science
        "TensorFlow", "PyTorch", "Pandas", "NumPy", "scikit-learn", "Keras",
        "Apache Spark", "Hadoop", "Snowflake", "Databricks",
        
        # BI Tools
        "Tableau", "Power BI", "Looker", "Qlik", "QlikView", "QlikSense",
    }
    return tools

def generate_keywords_database(output_path: str, skills_csv_path: str = None):
    """Generate comprehensive keywords database"""
    all_keywords = set()
    
    # 1. Load technical skills from skills.csv (if provided)
    if skills_csv_path is None:
        # Try to find it in the same directory
        script_dir = Path(__file__).parent
        skills_csv_path = script_dir / "skills.csv"
    
    if os.path.exists(skills_csv_path):
        technical_skills = load_technical_skills_from_csv(str(skills_csv_path))
        all_keywords.update(technical_skills)
        print(f"Added {len(technical_skills)} technical skills")
    else:
        print(f"Warning: skills.csv not found at {skills_csv_path}")
    
    # 2. Add business keywords
    all_keywords.update(BUSINESS_KEYWORDS)
    print(f"Added {len(BUSINESS_KEYWORDS)} business keywords")
    
    # 3. Add tools
    all_keywords.update(TOOLS_KEYWORDS)
    print(f"Added {len(TOOLS_KEYWORDS)} tool keywords")
    
    # 4. Add soft skills
    all_keywords.update(SOFT_SKILLS)
    print(f"Added {len(SOFT_SKILLS)} soft skills")
    
    # 5. Add certifications
    all_keywords.update(CERTIFICATIONS)
    print(f"Added {len(CERTIFICATIONS)} certifications")
    
    # 6. Add domain keywords
    all_keywords.update(DOMAIN_KEYWORDS)
    print(f"Added {len(DOMAIN_KEYWORDS)} domain keywords")
    
    # 7. Add tools from tech patterns
    tech_tools = extract_tools_from_tech_patterns()
    all_keywords.update(tech_tools)
    print(f"Added {len(tech_tools)} tools from tech patterns")
    
    # Sort and write to CSV
    sorted_keywords = sorted(all_keywords, key=str.lower)
    
    print(f"\nWriting {len(sorted_keywords)} keywords to {output_path}...")
    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Keyword'])  # Header
        for keyword in sorted_keywords:
            writer.writerow([keyword])
    
    print(f"✅ Successfully generated keywords database: {output_path}")
    print(f"   Total keywords: {len(sorted_keywords)}")

if __name__ == "__main__":
    script_dir = Path(__file__).parent
    output_path = script_dir / "keywords.csv"
    
    generate_keywords_database(str(output_path))
