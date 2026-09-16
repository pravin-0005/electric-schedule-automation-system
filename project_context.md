You are a senior full-stack AI engineer, engineering-document automation architect, Python developer, Excel automation specialist, and AI-agent developer.

Build a production-oriented application called:

ELECTRIC SCHEDULE AUTOMATION SYSTEM

The purpose of this application is to automatically generate an electrical schedule from:

1. An engineering drawing/PDF uploaded by the user.
2. An Excel schedule/template uploaded by the user.

The drawing contains the engineering information.
The Excel file contains the required schedule format, sheets, formulas, formatting, merged cells, headers, and possibly hidden/protected/reference sheets.

The system must understand the drawing, understand the Excel template structure, map engineering information into the correct schedule fields, and generate a COMPLETELY NEW Excel schedule.

==================================================
1. ABSOLUTE CORE RULE
==================================================

NEVER modify, overwrite, delete, or save over the user's original Excel template.

The original Excel file is READ-ONLY.

Always:

INPUT:
    drawing.pdf
    template.xlsx

OUTPUT:
    Generated_Electric_Schedule.xlsx

The generated workbook must be a NEW file.

The original template must remain untouched byte-for-byte.

Use Python/openpyxl or another reliable deterministic Excel-processing library for workbook creation.

Do not ask the AI/LLM to directly manipulate Excel binary files.

==================================================
2. MAIN WORKFLOW
==================================================

Implement this complete pipeline:

USER
 |
 |-- Upload Engineering Drawing/PDF
 |
 |-- Upload Excel Template
 |
 v
FILE VALIDATION
 |
 v
DRAWING EXTRACTION
 |
 v
ENGINEERING DATA NORMALIZATION
 |
 v
EXCEL TEMPLATE ANALYSIS
 |
 v
FIELD / COLUMN MAPPING
 |
 v
AI ENGINEERING REASONING
 |
 v
CHANGE / MAPPING REGISTER
 |
 v
USER REVIEW
 |
 |-- Approve
 |-- Reject
 |-- Override
 |
 v
DETERMINISTIC EXCEL GENERATION
 |
 v
EXCEL VALIDATION
 |
 v
FINAL OUTPUT
 |
 |-- Generated Excel
 |-- Validation Report
 |-- Extraction Report
 |-- Change Register
 |-- Evidence / Traceability
 |-- Processing Log


==================================================
3. TECHNOLOGY ARCHITECTURE
==================================================

Use the following architecture unless there is a strong technical reason to change it:

FRONTEND:
- Next.js
- React
- TypeScript
- Tailwind CSS

BACKEND:
- Python
- FastAPI

ORCHESTRATION:
- n8n

AI:
- LLM-based reasoning layer
- Make the LLM provider configurable.
- Do not hard-code a single provider.
- Support OpenAI-compatible APIs where practical.

DOCUMENT PROCESSING:
- Python
- PyMuPDF / fitz
- pdfplumber where useful
- OCR fallback when PDF text extraction is insufficient

EXCEL:
- openpyxl
- formulas must be preserved
- formatting must be preserved
- merged cells must be preserved
- hidden sheets must be preserved
- row heights / column widths should be preserved
- print settings should be preserved
- workbook structure should be preserved as far as technically possible

DATABASE:
- PostgreSQL

FILE STORAGE:
- Local storage during development
- Design storage abstraction so S3-compatible storage can be added later

OPTIONAL:
- Redis for jobs/cache if required

DEPLOYMENT:
- Docker / Docker Compose
- Separate frontend, backend, n8n and database services

==================================================
4. USER INTERFACE
==================================================

Create a simple professional engineering-oriented interface.

Main screens:

1. Dashboard
2. New Schedule
3. Upload Files
4. Drawing Analysis
5. Excel Template Analysis
6. Data Mapping
7. Review / Approval
8. Generation Progress
9. Results
10. Processing History
11. Schedule Details
12. Settings

Do NOT create an unnecessarily complicated UI.

The primary user may be an electrical engineer/designer rather than a software engineer.

The workflow should be obvious:

UPLOAD
  ↓
ANALYZE
  ↓
REVIEW
  ↓
GENERATE
  ↓
DOWNLOAD

==================================================
5. FILE UPLOAD
==================================================

Allow:

PDF:
- .pdf

Excel:
- .xlsx
- optionally .xlsm if supported safely

On upload:

1. Generate unique file ID.
2. Store file.
3. Calculate SHA-256 hash.
4. Record metadata.
5. Never modify original files.
6. Validate file type.
7. Validate file integrity.
8. Create processing job.

Store:

file_id
filename
file_type
size
sha256
upload_time
project_id
status

==================================================
6. DRAWING/PDF ANALYSIS
==================================================

The drawing may be a multi-page engineering drawing.

Do not assume a fixed page count.

Process every page.

Extract:

- text
- tables
- equipment identifiers
- cable identifiers
- circuit identifiers
- terminal numbers
- wire numbers
- connection information
- equipment descriptions
- voltage
- current
- ratings
- phase information
- cable size
- number of cores
- cable type
- source
- destination
- panel information
- breaker information
- contactor information
- relay information
- terminal block information
- motor information
- control circuit information
- instrument information
- revision information
- drawing number
- sheet number
- references
- notes
- legends
- title block data

Also identify spatial/contextual relationships when possible.

For each extracted value, retain:

field
value
page
bounding box if available
source text
confidence
extraction method

Example:

{
  "field": "cable_size",
  "value": "4C x 2.5 sq.mm",
  "page": 7,
  "source": "4C x 2.5 SQ.MM CU XLPE",
  "confidence": 0.96
}

==================================================
7. OCR FALLBACK
==================================================

If normal PDF text extraction fails or produces insufficient data:

1. Render page as image.
2. Run OCR.
3. Extract text.
4. Store OCR evidence.
5. Continue processing.

Never silently treat missing extraction as confirmed absence.

Differentiate:

FOUND
NOT_FOUND
UNCERTAIN
OCR_REQUIRED
CONFLICT

==================================================
8. ENGINEERING DATA NORMALIZATION
==================================================

Do not send raw PDF text directly to the final Excel generator.

Create a normalized engineering data model.

Example:

Project
Drawing
Equipment
Circuit
Cable
Connection
Terminal
Protection
Revision
Note

Example:

Equipment:
{
  "id": "...",
  "tag": "...",
  "description": "...",
  "type": "...",
  "rating": "...",
  "location": "...",
  "source_page": 4,
  "confidence": 0.94
}

Cable:
{
  "id": "...",
  "tag": "...",
  "from": "...",
  "to": "...",
  "size": "...",
  "cores": 4,
  "type": "...",
  "length": null,
  "source_page": 8,
  "confidence": 0.91
}

Connections:
{
  "from_equipment": "...",
  "from_terminal": "...",
  "to_equipment": "...",
  "to_terminal": "...",
  "wire_number": "...",
  "source_page": 8,
  "confidence": 0.88
}

Use a structured JSON representation internally.

==================================================
9. EXCEL TEMPLATE ANALYSIS
==================================================

The uploaded Excel is a TEMPLATE/REFERENCE.

Analyze it without modifying it.

Automatically discover:

- workbook name
- worksheet names
- sheet order
- visible sheets
- hidden sheets
- very hidden sheets if supported
- used ranges
- header rows
- data rows
- merged cells
- formulas
- formula patterns
- named ranges
- tables
- cell formatting
- borders
- fills
- fonts
- alignment
- number formats
- row heights
- column widths
- print areas
- page setup
- freeze panes
- validations
- conditional formatting
- protected cells/sheets where relevant
- formulas referencing other sheets
- formulas referencing ranges
- blank template rows
- repeated schedule blocks
- summary sections
- footer/header information

Do NOT assume:

- first row is header
- first sheet is the schedule
- one sheet contains everything
- columns are fixed
- formulas exist only in visible cells
- blank cells are unused

Determine the actual workbook structure dynamically.

==================================================
10. TEMPLATE PROFILING
==================================================

Create a machine-readable Template Profile.

Example:

{
  "workbook": "...",
  "sheets": [
    {
      "name": "Schedule",
      "index": 0,
      "hidden": false,
      "header_rows": [5,6],
      "data_start_row": 7,
      "columns": {
        "A": "SL_NO",
        "B": "CIRCUIT_ID",
        "C": "FROM",
        "D": "TO",
        "E": "CABLE_SIZE"
      }
    }
  ]
}

Also detect formula patterns.

Example:

F7 = D7*E7
F8 = D8*E8
F9 = D9*E9

Determine that the formula pattern should continue for generated rows.

==================================================
11. FORMULA HANDLING
==================================================

This is critical.

The system must understand existing formulas.

Never replace formulas with calculated values unless explicitly required.

When adding generated rows:

- copy formula patterns
- adjust relative references correctly
- preserve absolute references
- preserve cross-sheet references
- preserve named-range references where applicable

Example:

Original:
F7 = D7*E7
F8 = D8*E8

Generated:
F9 = D9*E9
F10 = D10*E10

Use deterministic formula generation.

Do not ask the LLM to calculate Excel formulas.

==================================================
12. TEMPLATE TO ENGINEERING FIELD MAPPING
==================================================

Create a mapping engine.

Example:

Drawing:
Cable ID → "C-102"
Cable Size → "4C x 2.5 sq.mm"
From → "DB-01"
To → "M-102"

Template:
Column B → Cable ID
Column C → From
Column D → To
Column E → Cable Size

Mapping:

{
  "template_column": "B",
  "template_field": "Cable ID",
  "source_field": "cable.id",
  "confidence": 0.98
}

Mappings can come from:

1. Exact header match
2. Synonym match
3. Semantic similarity
4. Engineering-domain rules
5. LLM reasoning
6. User override

The LLM must suggest mappings, not silently write uncertain data.

==================================================
13. ENGINEERING SYNONYMS
==================================================

Support engineering terminology variations.

Examples:

Cable No
Cable Number
Cable ID
Cable Tag

should potentially map to:

cable.id

Similarly:

From
Source
Origin

To:
Destination
Load
Receiving Equipment

Create a configurable engineering dictionary.

==================================================
14. AI REASONING LAYER
==================================================

Use AI for:

- interpreting drawing context
- resolving terminology
- identifying relationships
- mapping drawing fields to Excel fields
- resolving non-obvious engineering references
- identifying inconsistencies
- explaining uncertain mappings

Do NOT use AI for:

- directly editing Excel
- writing arbitrary workbook files
- replacing deterministic formulas
- silently inventing missing engineering data
- changing source evidence

AI output must be structured JSON.

Example:

{
  "decision": "MAP",
  "source": "cable.size",
  "target": "Cable Size",
  "value": "4C x 2.5 sq.mm",
  "confidence": 0.96,
  "evidence": [
    {
      "page": 8,
      "text": "4C x 2.5 SQ.MM"
    }
  ]
}

==================================================
15. NO HALLUCINATION RULE
==================================================

Never invent engineering values.

If a value is not found:

value = null

status = "NOT_FOUND"

If evidence conflicts:

status = "CONFLICT"

If interpretation is uncertain:

status = "UNCERTAIN"

Never convert uncertainty into a confident value.

==================================================
16. EVIDENCE AND TRACEABILITY
==================================================

Every populated engineering field should have traceability.

Example:

Excel Cell:
E12

Value:
4C x 2.5 sq.mm

Source:
Drawing page 8

Evidence:
"4C x 2.5 SQ.MM CU XLPE"

Confidence:
0.96

Store this in a change/evidence register.

Example:

{
  "cell": "E12",
  "value": "4C x 2.5 sq.mm",
  "source_page": 8,
  "source_text": "...",
  "confidence": 0.96
}

==================================================
17. CHANGE REGISTER
==================================================

Before Excel generation create a Change Register.

Columns:

- Target Sheet
- Target Cell
- Field
- Existing Template Value
- Proposed Value
- Source
- Source Page
- Evidence
- Confidence
- Reason
- Status

Status:

PROPOSED
APPROVED
REJECTED
OVERRIDDEN

The user must be able to review important changes.

==================================================
18. USER APPROVAL
==================================================

Provide:

Approve All
Reject All
Approve Selected
Reject Selected
Override Value

For uncertain or conflicting fields, require review.

The user can manually modify a proposed value before generation.

Record overrides in the audit log.

==================================================
19. EXCEL GENERATION
==================================================

After approval:

Create:

Generated_Electric_Schedule.xlsx

Never modify:

original_template.xlsx

Use a copy-based generation strategy:

1. Open original workbook read-only for analysis.
2. Create a separate output workbook based on the template structure.
3. Populate approved fields.
4. Add/copy rows when necessary.
5. Extend formulas.
6. Preserve formatting.
7. Preserve merged cells.
8. Preserve sheet order.
9. Preserve hidden sheets.
10. Preserve workbook metadata where possible.
11. Save only to a new output path.

Original:
template.xlsx

Output:
Generated_Electric_Schedule.xlsx

==================================================
20. IMPORTANT EXCEL PRESERVATION
==================================================

Preserve wherever supported:

- worksheet names
- worksheet order
- cell values
- formulas
- formatting
- borders
- fills
- fonts
- alignment
- number formats
- merged cells
- hidden rows
- hidden columns
- hidden sheets
- row heights
- column widths
- freeze panes
- print areas
- page orientation
- page margins
- page breaks
- data validation
- conditional formatting
- defined names
- tables
- hyperlinks

If a workbook feature cannot be safely preserved by the selected library:

1. Detect it.
2. Record warning.
3. Do not silently destroy it.

==================================================
21. GENERATED ROW HANDLING
==================================================

The number of engineering items may differ from the template's existing number of rows.

Support:

- fewer rows
- equal rows
- more rows

If more rows are required:

1. Identify the template's repeating schedule row pattern.
2. Insert/copy required rows.
3. Copy formatting.
4. Adjust formulas.
5. Maintain merged-cell structure.
6. Maintain borders and alignment.

Never blindly append data to the bottom of the workbook.

==================================================
22. VALIDATION
==================================================

After generation, perform deterministic validation.

Validate:

FILE:
- output exists
- output opens
- output is not zero bytes
- original file hash unchanged

WORKBOOK:
- expected sheets exist
- sheet order preserved
- formulas exist where expected
- merged cells preserved
- formatting preserved
- hidden sheets preserved

DATA:
- required fields populated
- no unauthorized invented values
- approved values match generated values
- row count correct
- duplicate identifiers detected

ENGINEERING:
- cable IDs consistent
- source/destination consistency
- terminal references consistent
- circuit references consistent
- duplicate equipment IDs detected
- conflicting values detected

FORMULA:
- formula patterns preserved
- relative references correctly shifted
- no broken references

==================================================
23. VALIDATION STATUS
==================================================

Return:

PASS

PASS_WITH_WARNINGS

FAIL

Example:

{
  "status": "PASS_WITH_WARNINGS",
  "errors": [],
  "warnings": [
    "Cable C-104 length was not found in drawing."
  ]
}

==================================================
24. REPORT GENERATION
==================================================

Generate:

1. Generated Excel
2. Validation Report
3. Extraction Report
4. Change Register
5. Evidence Report
6. Processing Log

The reports can be JSON and human-readable HTML/PDF where appropriate.

==================================================
25. DATABASE MODEL
==================================================

Use PostgreSQL.

Tables:

projects
files
processing_jobs
drawings
drawing_pages
engineering_entities
engineering_relationships
template_profiles
field_mappings
change_register
generated_files
validation_results
audit_logs

Example:

projects:
id
name
created_at

files:
id
project_id
filename
type
sha256
size
path
created_at

processing_jobs:
id
project_id
status
stage
progress
started_at
completed_at
error

engineering_entities:
id
project_id
entity_type
entity_id
data_json
confidence
source_page

field_mappings:
id
project_id
source_field
target_sheet
target_column
confidence
status

change_register:
id
project_id
sheet
cell
field
old_value
new_value
source
confidence
status
user_override

generated_files:
id
project_id
filename
path
sha256
created_at

==================================================
26. PROCESSING STATUS
==================================================

Show real-time stages:

UPLOAD
VALIDATING_FILES
READING_DRAWING
EXTRACTING_TEXT
RUNNING_OCR
NORMALIZING_ENGINEERING_DATA
ANALYZING_EXCEL_TEMPLATE
DETECTING_FORMULAS
MAPPING_FIELDS
AI_REVIEW
WAITING_FOR_USER
GENERATING_EXCEL
VALIDATING_EXCEL
COMPLETED
FAILED

Show progress in the frontend.

==================================================
27. n8n ORCHESTRATION
==================================================

Use n8n as the orchestration layer.

Workflow:

Webhook
 ↓
Validate Files
 ↓
Create Project Job
 ↓
PDF Extraction Service
 ↓
OCR if Required
 ↓
Engineering Normalization Service
 ↓
Excel Template Analysis Service
 ↓
Field Mapping Service
 ↓
AI Reasoning Node
 ↓
Create Change Register
 ↓
Wait for User Approval
 ↓
Excel Generation Service
 ↓
Validation Service
 ↓
Store Results
 ↓
Return Result

Do not put complex Excel manipulation directly into n8n Code nodes.

Use dedicated Python/FastAPI services.

==================================================
28. API DESIGN
==================================================

Create APIs such as:

POST /projects

POST /projects/{project_id}/upload/drawing

POST /projects/{project_id}/upload/template

POST /projects/{project_id}/analyze

GET /projects/{project_id}/status

GET /projects/{project_id}/drawing

GET /projects/{project_id}/template-profile

GET /projects/{project_id}/mappings

GET /projects/{project_id}/changes

POST /projects/{project_id}/changes/approve

POST /projects/{project_id}/changes/reject

POST /projects/{project_id}/changes/override

POST /projects/{project_id}/generate

GET /projects/{project_id}/validation

GET /projects/{project_id}/files

GET /projects/{project_id}/download/{file_id}

==================================================
29. SECURITY
==================================================

Implement:

- file type validation
- file size limits
- safe filenames
- path traversal protection
- isolated processing directories
- no execution of uploaded files
- API authentication architecture
- audit logging
- input validation
- environment variables for secrets

Never expose internal file paths to users.

==================================================
30. PROJECT DIRECTORY
==================================================

Use a clean monorepo structure:

electric-schedule/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── types/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── extraction/
│   │   ├── engineering/
│   │   ├── excel/
│   │   ├── validation/
│   │   └── ai/
│   └── tests/
│
├── n8n/
│   └── workflows/
│
├── database/
│   └── migrations/
│
├── storage/
│
├── tests/
│   ├── fixtures/
│   ├── pdf/
│   ├── excel/
│   └── integration/
│
├── docker-compose.yml
├── .env.example
├── README.md
└── docs/

==================================================
31. PYTHON EXCEL SERVICE
==================================================

Create a dedicated Excel service.

Responsibilities:

analyze_workbook()
profile_sheets()
detect_headers()
detect_data_regions()
detect_formulas()
detect_repeating_rows()
detect_merged_cells()
detect_formatting()
create_new_workbook()
populate_values()
extend_formulas()
copy_formatting()
preserve_structure()
validate_workbook()

Important:

The service must explicitly prevent accidental overwrite of the source workbook.

Implement:

source_path != output_path

and fail generation if they resolve to the same file.

==================================================
32. DRAWING EXTRACTION SERVICE
==================================================

Create modular services:

pdf_text_extractor.py
ocr_service.py
table_extractor.py
drawing_parser.py
entity_extractor.py
relationship_extractor.py
normalizer.py

Each extracted entity must contain provenance.

==================================================
33. AI SERVICE
==================================================

Create an abstraction:

AIProvider

Implement provider adapters.

Example:

OpenAIProvider
CompatibleLLMProvider

The rest of the application must not depend directly on a single LLM API.

Use structured JSON outputs.

Validate AI output using Pydantic schemas.

If AI returns invalid JSON:

1. retry
2. repair/parse safely
3. reject invalid output
4. never pass unvalidated AI output to Excel generation

==================================================
34. DETERMINISTIC VS AI RESPONSIBILITIES
==================================================

AI:

UNDERSTANDS

Deterministic Python services:

EXECUTE

Therefore:

AI decides:
"This drawing field corresponds to this template field."

Python executes:
"Write this approved value to this exact Excel cell."

AI decides:
"These two labels likely refer to the same equipment."

Python records:
the approved mapping.

AI must never directly generate the final workbook.

==================================================
35. SAMPLE DATA
==================================================

Create sample test fixtures.

Include:

- multi-page sample electrical PDF
- sample Excel schedule template
- template with formulas
- template with multiple sheets
- template with merged cells
- template with hidden sheet
- template with repeated rows

Test cases:

1. Normal successful generation
2. Missing drawing field
3. Conflicting drawing values
4. OCR-required page
5. More schedule rows than template
6. Fewer schedule rows than template
7. Formula extension
8. Hidden sheet preservation
9. Formatting preservation
10. Invalid uploaded file
11. Corrupted PDF
12. Corrupted Excel
13. AI mapping uncertainty
14. User override
15. Original template integrity verification

==================================================
36. GOLDEN TEST
==================================================

Create a golden end-to-end test:

INPUT:

500kV engineering drawing PDF

+
engineering Excel schedule/template

The test must execute:

upload
→ extraction
→ normalization
→ template profiling
→ mapping
→ change register
→ approval
→ new workbook generation
→ validation

Expected:

Generated_Electric_Schedule.xlsx

must be created separately from the input template.

The original template SHA-256 hash must remain unchanged.

==================================================
37. ERROR HANDLING
==================================================

Never silently fail.

Every failure should include:

stage
error_code
message
technical_details
recoverability

Example:

{
  "stage": "EXCEL_GENERATION",
  "error_code": "FORMULA_PATTERN_NOT_DETECTED",
  "message": "Unable to safely determine repeating formula pattern.",
  "recoverable": true
}

==================================================
38. LOGGING
==================================================

Use structured logs.

Example:

{
  "timestamp": "...",
  "project_id": "...",
  "stage": "TEMPLATE_ANALYSIS",
  "event": "FORMULA_PATTERN_DETECTED",
  "sheet": "Schedule",
  "details": {}
}

Never log API secrets.

==================================================
39. PERFORMANCE
==================================================

Support large multi-page drawings.

Use:

- asynchronous FastAPI jobs
- background workers where required
- page-level parallel processing where safe
- caching
- incremental processing
- progress reporting

Do not load unnecessarily huge files repeatedly into memory.

==================================================
40. UI RESULT PAGE
==================================================

After successful generation display:

Status:
PASS / PASS_WITH_WARNINGS

Project name

Input:
Drawing.pdf
Template.xlsx

Output:
Generated_Electric_Schedule.xlsx

Statistics:

Pages processed
Entities extracted
Mappings created
Mappings requiring review
Approved changes
Rejected changes
Overridden values
Rows generated
Formulas generated
Warnings
Errors

Buttons:

Download Excel
Download Validation Report
View Change Register
View Evidence
View Processing Log

==================================================
41. AUDITABILITY
==================================================

For every generated value, it should be possible to answer:

Where did this value come from?

Which drawing page?

Which source text?

Which engineering entity?

Which mapping produced it?

Who approved it?

Was it overridden?

Which Excel cell received it?

This is a core requirement.

==================================================
42. DO NOT BUILD THESE SHORTCUTS
==================================================

Do NOT:

- hard-code one specific Excel layout
- hard-code one specific drawing
- assume fixed sheet names
- assume fixed columns
- assume fixed page numbers
- overwrite the template
- fabricate missing values
- directly ask the LLM to create the Excel
- use screenshots as the only source of engineering data
- silently ignore extraction failures
- silently discard Excel formatting
- silently discard formulas
- create a fake demo instead of the real pipeline

The system must be general enough to process different electrical schedule drawings and templates.

==================================================
43. DEVELOPMENT STRATEGY
==================================================

Build incrementally.

PHASE 1:
Project scaffolding
Docker
PostgreSQL
FastAPI
Next.js
n8n

PHASE 2:
File upload
hashing
storage
project management

PHASE 3:
PDF extraction
OCR
engineering entity extraction

PHASE 4:
Excel template profiler

PHASE 5:
Field mapping engine

PHASE 6:
AI reasoning layer

PHASE 7:
Change register and review UI

PHASE 8:
Deterministic Excel generation

PHASE 9:
Validation

PHASE 10:
End-to-end testing

PHASE 11:
Production hardening

Do not attempt to build everything as one untested block.

After every phase:

1. Run tests.
2. Fix errors.
3. Verify functionality.
4. Continue to next phase.

==================================================
44. IMPLEMENTATION RULE
==================================================

When implementing code:

- write production-quality modular code
- use TypeScript types
- use Pydantic models
- use database migrations
- use environment variables
- add error handling
- add logging
- add unit tests
- add integration tests
- avoid unnecessary dependencies
- document important design decisions

Do not generate placeholder functions for core functionality.

If a component is initially mocked, clearly isolate it and then replace it with the real implementation before declaring the project complete.

==================================================
45. ACCEPTANCE CRITERIA
==================================================

The project is complete only when all of the following work:

[ ] User can create a project.

[ ] User can upload a PDF drawing.

[ ] User can upload an Excel template.

[ ] Original files remain unchanged.

[ ] System analyzes all drawing pages.

[ ] OCR fallback works.

[ ] Engineering entities are normalized.

[ ] System analyzes Excel workbook structure dynamically.

[ ] System detects sheets and headers.

[ ] System detects formulas.

[ ] System detects repeating schedule rows.

[ ] System maps engineering data to template fields.

[ ] AI mappings are structured and validated.

[ ] Uncertain mappings are flagged.

[ ] User can approve/reject/override mappings.

[ ] System creates a NEW Excel workbook.

[ ] Original template is never overwritten.

[ ] Formatting is preserved.

[ ] Formulas are preserved/extended.

[ ] Merged cells are preserved.

[ ] Hidden sheets are preserved.

[ ] Generated workbook passes validation.

[ ] Traceability exists for populated values.

[ ] Change register is generated.

[ ] Validation report is generated.

[ ] Processing history is stored.

[ ] Errors are visible to the user.

[ ] End-to-end golden test passes.

==================================================
46. FINAL USER EXPERIENCE
==================================================

The final experience should be:

1. User opens Electric Schedule Automation.

2. Clicks:
   "Create New Schedule"

3. Uploads:
   Engineering Drawing.pdf

4. Uploads:
   Schedule_Template.xlsx

5. Clicks:
   "Analyze"

6. System displays:
   "Drawing analyzed"
   "Excel template analyzed"
   "X engineering entities found"
   "Y mappings detected"
   "Z mappings require review"

7. User reviews important mappings.

8. User clicks:
   "Approve & Generate"

9. System creates:

   Generated_Electric_Schedule.xlsx

10. System validates it.

11. User downloads:

   Generated Excel
   Validation Report
   Change Register
   Evidence Report

==================================================
47. FIRST TASK
==================================================

Do NOT immediately generate a giant amount of code.

First:

1. Analyze this specification.
2. Create the complete system architecture.
3. Create the repository structure.
4. Create database schema.
5. Define API contracts.
6. Define normalized engineering JSON schema.
7. Define Excel Template Profile schema.
8. Define Change Register schema.
9. Define validation schema.
10. Define n8n workflow architecture.
11. Define frontend page/component architecture.
12. Define implementation phases.
13. Identify dependencies.
14. Create the initial project scaffolding.

Then implement Phase 1.

After Phase 1 is working, proceed phase-by-phase.

At every stage, keep the application runnable.

Do not declare the project complete until the actual PDF → engineering data → Excel template analysis → mapping → approval → NEW Excel generation → validation pipeline works end-to-end.

FINAL PRINCIPLE:

DRAWING + TEMPLATE
        ↓
UNDERSTAND
        ↓
EXTRACT
        ↓
NORMALIZE
        ↓
MAP
        ↓
REVIEW
        ↓
GENERATE NEW EXCEL
        ↓
VALIDATE
        ↓
DELIVER

The Excel template is NEVER modified.
The final schedule is ALWAYS a NEW Excel file.



******pending task******
1.Build the engineering workspace and guided schedule intake
2.Scaffold FastAPI, PostgreSQL, and n8n services
3.Verify foundation contracts and responsive interface
***********************************************