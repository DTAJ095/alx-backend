#!/usr/bin/env python3
""" Infer appropriate time zone """
from flask import Flask, render_template, request
from flask_babel import Babel
from typing import Union, Dict
import pytz

app = Flask(__name__)
babel = Babel(app)

class Config():
    """ Config class """
    LANGUAGES = ["en", "fr"]
    babel.default_locale = "en"
    babel.default_timezone = "UTC"
    DEBUG = True

app.config.from_object(Config)
app.url_map.strict_slashes = False

users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}

def get_user() -> Union[dict, None]:
    """ Get user """
    try:
        return users.get(int(request.args.get('login_as')))
    except Exception:
        return None

@app.before_request
def before_request():
    """ Before request """
    user = get_user()
    if user:
        request.user = user

@babel.localeselector
def get_locale() -> str:
    """ Get locale """
    locale = request.args.get('locale')
    if locale and locale in app.config['LANGUAGES']:
        return locale
    if request.user:
        locale = request.user.get('locale')
        if locale and locale in app.config['LANGUAGES']:
            return locale
    return request.accept_languages.best_match(app.config['LANGUAGES'])

@babel.timezoneselector
def get_timezone() -> str:
    """ Get timezone """
    timezone = request.args.get('timezone')
    if not timezone and request.user:
        timezone = request.user.get('timezone')
    try:
        pytz.timezone(timezone)
        return timezone
    except pytz.exceptions.UnknownTimeZoneError:
        return babel.default_timezone

@app.route('/', strict_slashes=False)
def index():
    """ Index page """
    return render_template('7-index.html')


if __name__ == "__main__":
    app.run(debug=True)
