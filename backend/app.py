from flask import Flask, request, jsonify
import os
from datetime import datetime
import logging
from logging.handlers import RotatingFileHandler
from dotenv import load_load_dotenv
from anthropic import Anthropic
from pathlib import Path

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)


# Configure logging
def setup_logging():
    # Create logs directory if it doesn't exist
    Path("logs").mkdir(exist_ok=True)

    # Configure file handler
    file_handler = RotatingFileHandler(
        "logs/app.log",
        maxBytes=10240,  # 10KB per file
        backupCount=10,  # Keep 10 backup files
    )

    # Configure logging format
    formatter = logging.Formatter(
        "[%(asctime)s] %(levelname)s in %(module)s: %(message)s"
    )
    file_handler.setFormatter(formatter)

    # Add handler to app logger
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)


# Initialize Anthropic client
def get_anthropic_client():
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY environment variable not set")
    return Anthropic(api_key=api_key)


# Initialize logging
setup_logging()


# Test route
@app.route("/api/test", methods=["GET"])
def test_connection():
    try:
        # Test Anthropic connection
        client = get_anthropic_client()
        return jsonify({"status": "success", "message": "API connection successful"})
    except Exception as e:
        app.logger.error(f"API test failed: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500


# Main lesson plan generation route
@app.route("/api/generate-lesson", methods=["POST"])
def generate_lesson():
    try:
        # Log request
        app.logger.info(f"Received lesson plan request: {request.json}")

        # Validate request data
        data = request.json
        required_fields = ["topic", "grade", "class_duration", "objectives"]

        if not all(field in data for field in required_fields):
            raise ValueError("Missing required fields")

        # Initialize AI client
        client = get_anthropic_client()

        # Process lesson plan (placeholder for now)
        # TODO: Move AI processing logic from Streamlit here

        # Log success
        app.logger.info(
            f"Successfully generated lesson plan for topic: {data['topic']}"
        )

        return jsonify(
            {
                "status": "success",
                "message": "Lesson plan generated successfully",
                "data": {},  # Add processed data here
            }
        )

    except ValueError as ve:
        app.logger.error(f"Validation error: {str(ve)}")
        return jsonify({"status": "error", "message": str(ve)}), 400

    except Exception as e:
        app.logger.error(f"Error generating lesson plan: {str(e)}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500


if __name__ == "__main__":
    app.run(debug=True)
