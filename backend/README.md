
# This is the schema for the resume saved



{
    "result": {
        "summary": "Highly motivated and skilled FullStack Developer with experience in developing web applications, implementing backend APIs, and integrating various technologies to enhance user engagement and optimize performance.",
        "experience": [
            {
                "company": "FOKER",
                "position": "FullStack Developer",
               
                "description": "• Implemented AWS S3 multipart to optimize storage and performance for large file uploads\n• Developed a social media sharing interface for seamless content distribution\n• Built a blog-sharing feature on the website using React, enhancing user engagement\n• Implemented backend API endpoint for user Matches and card Swipe features.",
               
            },
            {
                "company": "DOTKONNEKT",
                "position": "SDE Intern",
                "description": "• Developed authentication system for an eCommerce platform using JWT, ensuring secure user access\n• Wrote RESTful APIS for the product core functionality.\n• Integrated with PDF.js and PDF-dist to render PDFS on the webpage",
                
            }
        ],
        "skills": [
            "JavaScript",
            "C++",
            "C",
            "Python",
            "SQL",
            "React.js",
            "Node.js",
            "Express",
            "MongoDB",
            "Next.js",
            "GitHub",
            "PostgreSQL",
            "Docker",
            "TailWind",
            "AWS"
        ],
        "projects": [
            {
                "name": "yourPrompts - Mini map/List of all the prompts (Web APIS & React.js)",
                "description": "• A Chrome extension that scrapes user prompts from ChatGPT, provides seamless navigation between Prompts\n• Real-time DOM monitoring using MutationObserver with debouncing to track conversation changes and extract\nuser Prompts\n• Draggable React overlay with smooth scrolling navigation, message indexing, and hover tooltips for enhanced\nuser experience\n• state management system with message caching and duplicate injection prevention for optimal performance",
                "technologies": [
                    "Web APIS",
                    "React.js"
                ],
               
            },
            {
                "name": "Resume Editing Using AI (React.js, Node.js & OpenRouter)",
                "description": "• Developed a browser extension that tailors resumes to job descriptions scraped from LinkedIn\n• Integrated OpenRouter for AI models and n8n Webhook in a Node.js backend to extract keywords from JDs\n• Enabled real-time resume customization using AI-enhanced pipelines and frontend-backend integration",
                "technologies": [
                    "React.js",
                    "Node.js",
                    "OpenRouter"
                ],
               
            },
            {
                "name": "Idea-And-Memeory(On-Going)",
                "description": "• Interactive web app featuring animated Three.js backgrounds and draggable idea cards\n• Implemented modal input for Google Maps links, rendered dynamically via iframe\n• Used React Context API to manage shared state across components for persistent info\n• Integrated dnd-kit to drag and drop idea cards into a \"Memories\" zone with images and descriptions",
                "technologies": [],
            },
            {
                "name": "Geo-Fenced Social Interaction (Node.js & mongoDB)",
                "description": "• Built a social app that enables users to discover others in proximity by scanning a QR code at physical locations\n• Implemented geo-fencing to limit interaction to users within a set area, with automatic session deletion.\n• Designed swipe-based matching and real-time chat functionality to encourage spontaneous social interaction",
                "technologies": [
                    "Node.js",
                    "mongoDB"
                ],
            }
        ]
    }
}

## Environment Setup

Create a `.env` file in the `backend/` directory with the following variables:

```
PORT=3000
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CSE_ID=your_custom_search_engine_id
```

- `GOOGLE_API_KEY`: Google API key with access to Custom Search JSON API
- `GOOGLE_CSE_ID`: Your Custom Search Engine ID (CSE) configured to search the web

Then start the server:

```
npm run dev
```

The HR Lookup endpoint will be available at `POST /hr-lookup`.