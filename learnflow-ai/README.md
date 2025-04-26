# LearnFlow AI

A Python project using UV for dependency management.

## Prerequisites

- Python 3.x
- UV (Python package manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd learnflow-ai
```

2. Install UV if you haven't already:
```bash
pip install uv
```

3. Create and activate a virtual environment:
```bash
uv sync
```


## Environment Setup

4. Create a `.env` file in the root directory with the following content:
```
GEMINI_API_KEY=your_api_key_here
```

## Running the Project

5. Run the main application:
```bash
uv run fastapi dev
```

## Project Structure

- `main.py` - Main application entry point
- `explanationGenerator.py` - Core functionality implementation
- `requirements.txt` - Project dependencies
- `pyproject.toml` - Project configuration
- `uv.lock` - UV dependency lock file
- `.env` - Environment variables


