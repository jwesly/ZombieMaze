var createArray = function(dim,init){//takes an array of dimensions and the initial value of each element
	if(dim.length > 0){
		var x = new Array();
		for(var i = 0; i < dim[0]; i++)
			x[i] = createArray(dim.slice(1),init)
		return x;
	}
	return JSON.parse(JSON.stringify(init));
}


var node = function(row,col){
	this.col = col;
	this.row = row;
}


var Maze = function(length,width){
	var genRandom = function(){
		return Math.floor(Math.random()*4);//0: right, 1: down, 2: left, 3: up
	}
	
	this.length = length + 1;
	this.width = width + 1;
	this.walls = createArray([this.width,this.length],{top: false,left: false});
	for(var i=0;i<this.length;i++){
		this.walls[0][i].top = true;
		this.walls[this.width-1][i].top = true;
	}
	for(var j=0;j<this.width;j++){
		this.walls[j][0].left = true;
		this.walls[j][this.length-1].left = true;
	}
	
	this.walls[0][0].left = false;
	this.walls[this.width-1][this.length-1].left = false;
	//console.log(this.walls);
	var furthest = new node(0,0);
	var current = new node(0,0);
	var destination = new node(width-1,length-1);
	console.log(destination);
	var nodes = createArray([width,length],0);
	var validMove = function(move){
		if(move==0 && ((current.col + 1 >= destination.col && current.row != destination.row) || nodes[current.row][current.col+1]!=0))
			return false;
		if(move==1 && ((current.row + 1 >= destination.row && current.col != destination.col)||  typeof nodes[current.row+1] === 'undefined' || nodes[current.row+1][current.col]!=0))
			return false;
		if(move==2 && (current.col-1 < 0 || current.row == destination.row || current.row == 0 || nodes[current.row][current.col-1]!=0))
			return false;
		if(move==3 && (current.row-1 < 0 || current.col == destination.col || current.col == 0 || nodes[current.row-1][current.col]!=0))
			return false;
		return true;
	}
	nodes[0][0] = 1;
	//console.log(nodes);
	var step = 1;
	do{
		var move;
		do{
			move = genRandom();
		}
		while(!validMove(move));
		step++;debugger;
		switch(move){
			case 0://move right
				current.col++;
				break;
			case 1://move down
				current.row++;
				break;
			case 2://move left
				current.col--;
				break;
			case 3://move up
				current.row--;
				break;
		}
		console.log(move,current!=destination,current);
		nodes[current.row][current.col]=step;
		console.log(nodes);

	}while(current!=destination);

}

Maze.prototype.display = function(){
	var line;
	for(var i=0; i < this.width; i++){
		line = "";
		for(var j = 0; j < this.length; j++){
			if(i > 0 && this.walls[i-1][j].left===true){
				line+="|";
			}
			else
				line+=" ";
			if(this.walls[i][j].top===true)
				line+="_";
			else
				line+=" "
		}
		console.log(line);
	}
}

var m = new Maze(8,5);
m.display();