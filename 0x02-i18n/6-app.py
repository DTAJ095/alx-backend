#!/usr/bin/env python3
""" Use user locale """
from flask import Flask, render_template, request, g
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
    """ flask app configuration class """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"
    DEBUG = True


app.config.from_object(Config)
app.url_map.strict_slashes = False


def get_user(id) -> Union[Dict[str, Union[str, None]], None]:
    """ get user from users """
    try:
        return users.get(int(id), {})
    except Exception:
        return None


@app.before_request
def before_request():
    """ before get locale request """
    setattr(request, 'user', get_user(request.args.get('login_as')))


@babel.localeselector
def get_locale() -> str:
    """ get the current location of the user """
    locale = request.args.get('locale')
    if locale and locale in app.config['LANGUAGES']:
        return locale
    if g.user:
        locale = g.user.get('locale')
        if locale and locale in app.config['LANGUAGES']:
            return locale
    locale = request.headers.get('locale', None)
    if locale in app.config['LANGUAGES']:
        return locale
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/', strict_slashes=False)
def index() -> str:
    """ return index page """
    return render_template('5-index.html')


if __name__ == "__main__":
    app.run(debug=True)
