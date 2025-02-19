from flask import Flask, request, jsonify, render_template
import logging
from logging.handlers import RotatingFileHandler
from anthropic import Anthropic

from config import config


def create_app():
    """Application factory function"""
    app = Flask(
        __name__,
        static_folder=str(config.STATIC_FOLDER),
        template_folder=str(config.TEMPLATE_FOLDER),
    )

    # Set up logging
    handler = RotatingFileHandler(
        str(config.LOG_FILE),
        maxBytes=config.LOG_MAX_BYTES,
        backupCount=config.LOG_BACKUP_COUNT,
    )
    handler.setFormatter(logging.Formatter(config.LOG_FORMAT))
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.INFO)

    # Initialize Anthropic client
    anthropic_client = Anthropic(api_key=config.ANTHROPIC_API_KEY)

    # Routes
    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/api/test", methods=["GET"])
    def test_connection():
        try:
            # Test Anthropic connection
            return jsonify(
                {"status": "success", "message": "API connection successful"}
            )
        except Exception as e:
            app.logger.error(f"API test failed: {str(e)}")
            return jsonify({"status": "error", "message": str(e)}), 500

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

            # TODO: Process lesson plan using AI processor
            # We'll integrate the AI processing logic in the next step

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

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=config.DEBUG)
