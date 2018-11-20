import React from 'react'
import Sound from 'react-sound'
import ReactDom from 'react-dom'
import Muro from '../assets/column.png'
import Muro2 from '../assets/column.png'
import Piso from '../assets/horizontal.png'
import Goal from '../assets/door.png'
import Front from '../assets/guy-front.png'
import Back from '../assets/guy-back.png'
import Left from '../assets/guy-left.png'
import Right from '../assets/guy-right.png'
import './style.css'
import Axios from 'axios'

class Board extends React.Component{
	constructor(props){
		super(props)

		this.state = {
			Position: [[null]],
			StartPos: {x: 0, y: 0},
			EndPos: {x: 0, y: 0},
			w: 20,
			h: 10,
			map: [[null]],
			templateRows: '',
			templateColumns: '',
			width: 0,

		}

		this.Generator()
	}

Generator() {
		var Sound = require('react-sound').default;
		var serverMaze = 'http://34.210.35.174:3001?w=' + this.state.w + '&h=' + this.state.h + '&type=json';
		Axios.get(serverMaze)
			.then(res => {
				var gridRows = '';
				var gridCols = '';
				var newMaze = [];
				var newGuy = [];
				var jumpCol = {};
				var prev = '';

				for (var i = 0; i < res.data[0].length; i++) {
					if (prev == '-' && res.data[0][i] == '-') {
						jumpCol[i] = null;
					}
					prev = res.data[0][i];
				}

				for (var i = 0; i < res.data.length; i++) {

					newMaze.push([]);
					newGuy.push([]);

					for (var j = 0; j < res.data[i].length; j++) {
						if (jumpCol.hasOwnProperty(j)) continue;

						if (res.data[i][j] == 'p') {
							newGuy[i].push({backgroundImage: 'url(' +Front+ ')'})
							this.setState({StartPos:{x: j, y: i}})
						} else {
							newGuy[i].push({});
						}

						if (res.data[i][j] == '+' || res.data[i][j] == '-' || res.data[i][j] == '|') {
							newMaze[i].push(Muro);
						} else {
							newMaze[i].push(Piso);
							if (i > 0) {
								if (newMaze[i-1][newMaze[i].length-1] === Muro) {
									newMaze[i-1][newMaze[i].length-1] = Muro2;
								}
							}
						}

						prev = res.data[i][j];
					}
				}

				newMaze[newMaze.length-2][newMaze[0].length-2] = Goal;
				this.setState({EndPos: {x: newMaze.length-2, y: newMaze.length-2}})


				var tempWidth = 0;
				for (var i = 0; i < newMaze.length; i++) {
					gridRows += '30px ';
				}

				for (var i = 0; i < newMaze[0].length; i++) {
					gridCols += '30px ';
					tempWidth += 30;
				}

				this.setState({
					map: newMaze,
					templateRows: gridRows,
					templateColumns: gridCols,
					width: tempWidth,
					Position: newGuy
				});
			})
			.catch(error => {
				console.log(error);
			})
	}

	
	handleClick(){
		this.Generator()
	}

	handleKeyDown(event){
		//Controles
		var upArrow = event.keyCode;
		var downArrow = event.keyCode;
		var leftArrow = event.keyCode;
		var rightArrow = event.keyCode;
		//Estado de posiciones
		var x = this.state.StartPos.x;
		var y = this.state.StartPos.y;
		//Posicion Actual
		var tempPosition = this.state.Position;

		if (upArrow == 38) {

			if (!(this.state.map[y-1][x] == Muro || this.state.map[y-1][x] == Muro2)) {

				tempPosition[y][x] = {};
				tempPosition[y-1][x] = {backgroundImage: 'url(' +Back+ ')'};
				this.setState({
					Position: tempPosition,
					StartPos: {x: x, y: y-1}
				});
					if (this.state.EndPos.x == x && this.state.EndPos.y == y-1) {
						alert("Has llegado al final !")
						window.location.reload();

					}
			}
		}
		else if (downArrow == 40) {

			if (!(this.state.map[y+1][x] == Muro || this.state.map[y+1][x] == Muro2)) {

				tempPosition[y][x] = {};
				tempPosition[y+1][x] = {backgroundImage: 'url(' +Front+ ')'};
				this.setState({
					Position: tempPosition,
					StartPos: {x: x, y: y+1}
				});
					if (this.state.EndPos.x == x && this.state.EndPos.y == y+1) {
						alert("Has llegado al final !")
  						window.location.reload();
					}
			}
		} 

		else if (leftArrow == 37 ) {
			if (!(this.state.map[y][x-1] == Muro || this.state.map[y][x-1] == Muro2)) {

				tempPosition[y][x] = {};
				tempPosition[y][x-1] = {backgroundImage: 'url(' +Left+ ')'};
				this.setState({
					Position: tempPosition,
					StartPos: {x: x-1, y: y}
				});

					if (this.state.EndPos.x == x-1 && this.state.EndPos.y == y) {
						alert("Has llegado al final !")
						window.location.reload();

					}
			}
		} 


		else if (rightArrow == 39) {

			if (!(this.state.map[y][x+1] == Muro || this.state.map[y][x+1] == Muro2)) {

				tempPosition[y][x] = {};
				tempPosition[y][x+1] = {backgroundImage: 'url(' +Right+ ')'};
				this.setState({
					Position: tempPosition,
					StartPos: {x: x+1, y: y}
				});
					if (this.state.EndPos.x == x+1 && this.state.EndPos.y == y) {
						alert("Has llegado al final !")
						window.location.reload();

					}
			}
		} 
	}

	handleWidthChange(event) {
		this.setState({w: event.target.value})
	}

	handleHeightChange(event) {
		this.setState({h: event.target.value})
	}


	render(){
	const gridStyle = {
				position: 'absolute',
				display: 'grid',
				gridTemplateRows: this.state.templateRows,
				gridTemplateColumns: this.state.templateColumns,
				gridGap: '0px',
				margin: '10px auto',
				marginLeft: '600px',
				width: this.state.width
			}
		return (
							<div className = "mainDiv" >
								<div className = "parent">
									  <h1>LABORATORIO #7 -- GENERADOR DE LABERINTOS <hr/></h1>
								</div>	
								<div className = "inputBox">
									<input type = "button" value = "GENERATE" className = "button" onClick = {this.handleClick.bind(this)}/>

									<input placeholder = "width" type="text" class="simple-tb" value = {this.state.w} onChange = {this.handleWidthChange.bind(this)}/>
									<label className = "labels">WIDTH</label>

									<input placeholder = "height" type="text" class="simple-tb"  value = {this.state.h} onChange = {this.handleHeightChange.bind(this)}/>
									<label className = "labels">HEIGHT</label>
								</div>
								<Sound
								      url="../assets/Pixelland.mp3"
								      playStatus={
								      	Sound.status.PLAYING
								      }
								      playFromPosition={300}
								      onLoading={
								      	this.handleSongLoading
								      }
								      onPlaying={
								      	this.handleSongPlaying
								      }
								      onFinishedPlaying={
								      	this.handleSongFinishedPlaying
								      }
								    />
								<div onKeyDown={
									this.handleKeyDown.bind(this)
								} tabIndex="0" autoFocus>
									<div style = {gridStyle} ref={(div) => {
										this.maze = div;
									}}>
										{
											this.state.map.map((row)=>{
												return (
													row.map((col)=>{
														return (
															<div style = {{backgroundImage: 'url(' +col+ ')'}}>
															</div>
														)
													})
												)
											})
										}
									</div>
									<div style = {gridStyle}>
										{
											this.state.Position.map((row)=>{
												return (
													row.map((col)=>{
														return (
															<div style = {col}>
															</div>
														)
													})
												)
											})
										}
									</div>
								</div>
							</div>
		)
	}
}

ReactDom.render(
	<Board />,
	document.getElementById('root')
)
