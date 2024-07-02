#!/usr/bin/emv python3
""" Basic babel setup """
from flask import Flask, render_template
from flask_babel import Babel
app = Flask(__name__)
babel = Babel(app)


class Config():
    """ Config class """
    LANGUAGES = ["en", "fr"]
    babel.default_locale = "en"
    babel.default_timezone = "UTC"

app.config.from_object(Config)
app.url_map.strict_slashes = False

@app.route('/', strict_slashes=False)
def index():
    """ Index page """
    return render_template('1-index.html')


if __name__ == '__main__':
    app.run(debug=True)