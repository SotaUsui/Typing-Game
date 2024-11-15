
class TypingGame extends React.Component {
    constructor(props) {
        super(props);        // enable to use "this" state.
        this.state = {
            sentence: "This is a typing game.",
            userInput: "",
            pass: 0, 
            time: 0,
            game: true 
        };
    }
    // Cycle method
    // defined when method works
    componentDidMount() {
        this.interval = setInterval(this.tick, 10);            // update time by calling tick function by 0.01s
        window.addEventListener('keydown', this.getInput);     // check user input, and call getInput function.
    }
    // end methods
    componentWillUnmount() {
        clearInterval(this.interval);
        window.removeEventListener('keydown', this.getInput);
    }

    // update time
    tick = () => {
        this.setState((prevState) => ({
            time: prevState.time + 1
        }));
    };

    // get keyboard input
    getInput = (event) => {
        const { sentence, pass } = this.state;
        const ui = event.key;

        this.setState({ userInput: ui }, () => {
            this.checkInput();
        });
    };

    // check user input and the letter user suppose to type
    checkInput() {
        const { userInput, pass, currChar, sentence} = this.state;
        console.log('userInput:', userInput);
        console.log('currChar:', currChar);
        if (userInput === sentence[pass]) {
            this.setState((prevState) => ({
                pass: prevState.pass + 1,
            }), () => {
                this.checkGame();
                this.setState({ userInput: ""});
            });
        }
        else{
            this.setState({ userInput: ""});
        }

    };

    // cehck if the game is done
    checkGame() {
        const { pass, sentence } = this.state;
        if (pass == sentence.length){
            clearInterval(this.interval);

            this.setState({game: false}, () => {
                // Send POST request to Flask backend and store the score.
                fetch('/game-end', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        time: this.state.time
                    })
                })
                .then(response => {
                    
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            });
        }
    }

    // draw game screen
    render() {
        const { sentence, time, userInput, pass, game } = this.state;
        const seconds = Math.floor(time / 100);
        const milliseconds = (time % 100).toString().padStart(2, '0');

        return (
            <div>
                <div className = "playing">
                    <h2>
                        <div className="time">Time: {seconds}.{milliseconds} sec</div>
                        <div className="pass">Pass: {pass}</div>
                        <div className="sentence">{sentence}</div>
                        <div className={`user-input ${userInput === sentence[pass] ? 'correct' : ''}`}>{sentence.slice(0, pass)}</div>
                    </h2>
                </div>

                <dialog open={!game} className="playend">
                    <h2>Your score: {seconds}.{milliseconds} sec</h2>
                    <p>Would you like to go back to the main menu or check the ranking?</p>
                    <button onClick={() => window.location.href = "/"}>Main Menu</button>
                    <button onClick={() => window.location.href = "/ranking/"}>Ranking</button>
                </dialog>
            </div>
        );
    }

}

ReactDOM.render(<TypingGame />, document.getElementById("root"));
