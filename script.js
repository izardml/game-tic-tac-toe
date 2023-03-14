class Square {
    constructor(x, y, width, height, ctx) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.ctx = ctx
        this.actor = null
    }

    draw() {
        this.ctx.strokeStyle = 'black'
        this.ctx.shadowBlur = 30
        this.ctx.shadowColor = 'black'
        this.ctx.lineWidth = 7
        this.ctx.strokeRect(this.x, this.y, this.width, this.height)

        if(this.actor) {
            this.ctx.fillStyle = 'black'
            this.ctx.font = '80px Arial'
            this.ctx.textAlign = 'center'
            this.ctx.shadowBlur = 30
            this.ctx.shadowColor = 'black'
            this.ctx.fillText(this.actor, this.x + this.width / 2, this.y + this.height / 2 + 30)
        }
    }
}

class TicTacToe {
    constructor(id) {
        this.canvas = document.getElementById(id)
        this.ctx = this.canvas.getContext('2d')
        this.squares = []

        const w = this.canvas.width / 3
        const h = this.canvas.height / 3

        for(let x = 0; x < 3; x++) {
            for(let y = 0; y < 3; y++) {
                this.squares.push(new Square(x * w, y * h, w, h, this.ctx))
            }
        }

        this.actors = ['X', 'O']
        this.turn = 0
        this.gameOver = false
        this.squares.forEach(squares => squares.draw())
        this.canvas.addEventListener('click', function(e) {
            this.click(e)
        }.bind(this))
    }

    click(e) {
        if(this.gameOver) {
            this.reset()
            return
        }

        const x = e.offsetX
        const y = e.offsetY

        for(let square of this.squares) {
            if(square.actor != null) continue
            if(x >= square.x && x <= square.x + square.width && y >= square.y && y <= square.y + square.height) {
                square.actor = this.actors[this.turn]
                this.ctx.shadowBlur = 30
                this.ctx.shadowColor = 'black'
                square.draw()

                this.turn = (this.turn + 1) % this.actors.length
            }
        }

        this.checkForWinner()
    }

    checkForWinner() {
        const winnerCombinations = [
            // COLS
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            // ROWS
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            // DIAGONALS
            [0, 4, 8], [2, 4, 6]
        ]

        for(let i = 0; i < winnerCombinations.length; i++) {
            let combination = winnerCombinations[i]

            let s1 = this.squares[combination[0]]
            let s2 = this.squares[combination[1]]
            let s3 = this.squares[combination[2]]

            if(s1.actor != null) {
                if(s1.actor == s2.actor && s1.actor == s3.actor) {
                    this.gameOver = true

                    this.ctx.beginPath()
                    this.ctx.moveTo(s1.x + s1.width / 2, s1.y + s1.height / 2)
                    this.ctx.lineTo(s3.x + s3.width / 2, s3.y + s3.height / 2)
                    this.ctx.lineWidth = 7
                    this.ctx.stroke()

                    this.ctx.fillStyle = 'white'
                    this.ctx.font = '80px Arial'
                    this.ctx.textAlign = 'center'
                    this.ctx.shadowBlur = 30
                    this.ctx.shadowColor = 'black'
                    this.ctx.fillText(s1.actor + ' Wins!', this.canvas.width / 2, this.canvas.height / 2 + 20)
                }
            }
        }

        if(!this.gameOver && this.squares.filter(square => square.actor == null).length == 0) {
            this.gameOver = true
            this.ctx.fillStyle = 'red'
            this.ctx.font = '80px Arial'
            this.ctx.textAlign = 'center'
            this.ctx.shadowBlur = 30
            this.ctx.shadowColor = 'black'
            this.ctx.fillText('Draw!', this.canvas.width / 2, this.canvas.height / 2 + 20)
        }
    }

    reset() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.squares.forEach(squares => squares.actor = null)
        this.squares.forEach(squares => squares.draw())
        this.turn = 0
        this.gameOver = false
    }
}

new TicTacToe('canvas')