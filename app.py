# Build a web application using Flask and store user scores in a database

from flask import Flask, request, render_template, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
import os


app = Flask(__name__)
app.secret_key = 'gnapn4a89na-4na30m30'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.abspath(os.path.curdir) + '/test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database model
class Score(db.Model):
    username = db.Column(db.String, primary_key=True)
    score = db.Column(db.Float, nullable=False)


#print test.db
def print_database():
    # Query the Score table to get all rows
    scores = Score.query.all()

    # Print the contents of the database
    for score in scores:
        print(f"Username: {score.username}, Score: {score.score}")

    return 'Check your console for database contents'


# Running the application within a Flask application context
with app.app_context():
    # Create the table
    db.create_all()


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        message = session.pop('message', None)
        return render_template('index.html', message=message)
    
    if request.method == 'POST':
        player = request.form['username']   # Get username from username input
        
        existing_player = Score.query.filter_by(username=player).first()
        if existing_player:
            mes = "This username is already taken..."
            session['message'] = mes
            return redirect(url_for('index'))
        

        session['username'] = player        # Store username in session
        return redirect(url_for('play'))    # Redirect to the play route

@app.route('/play/', methods=['GET', 'POST'])
def play():
    if request.method == 'GET':
        return render_template('play.html')


@app.route('/game-end', methods=['POST'])
def game_end():
    if request.method == 'POST':
        score = request.json.get('time')    # Get score from POST data as a json data
        data = Score(username=session.get('username'), score=score)
        db.session.add(data)
        db.session.commit()
        print_database()
        return 'Score saved successfully'


@app.route('/ranking/', methods=['GET', 'POST'])
def ranking():
    if request.method == 'GET':
        scores = Score.query.order_by(Score.score.asc()).all()
        return render_template('ranking.html', scores = scores)
    if request.method == 'POST':
        return redirect(url_for('index')) 

