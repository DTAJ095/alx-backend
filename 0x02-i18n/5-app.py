#!/usr/bin/env python3
""" Mock logging in """
from flask import Flask, render_template, request
from flask_babel import Babel
from typing import Union, Dict

app = Flask(__name__)
babel = Babel(app)

users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


class Config():
    """ config class """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"
    DEBUG = True


app.config.from_object(Config)
app.url_map.strict_slashes = False


def get_user(id) -> Union[Dict[str, Union[str, None]], None]:
    """ get user """
    try:
        return users.get(int(id), 0)
    except Exception:
        return None


@app.before_request
def before_request():
    """ before request """
    user = get_user(id)
    if user:
        request.user = user


@babel.localeselector
def get_locale() -> str:
    """ get locale """
    locale = request.args.get('locale')
    if locale and locale in app.config['LANGUAGES']:
        return locale
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/', strict_slashes=False)
def index() -> str:
    """ index """
    return render_template('5-index.html')


if __name__ == "__main__":
    app.run(debug=True)
