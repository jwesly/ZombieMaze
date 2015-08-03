var createArray = function(dim,init){//takes an array of dimensions and the initial value of each element
	if(dim.length > 0){
		var x = new Array();
		for(var i = 0; i < dim[0]; i++)
			x[i] = createArray(dim.slice(1),init)
		return x;
	}
	return JSON.parse(JSON.stringify(init));//return copy of object
}


var node = function(row,col){
	this.row = row;
	this.col = col;
}

var Rand = function(num){
	var prev = [];
	if(typeof num === 'undefined')
		num = 4;
	this.get = function(){
		if(prev.length==num)
			return undefined;
		do{
			var x = Math.floor(Math.random()*num)
		}
		while(prev.indexOf(x)!=-1)
		prev.push(x);
		return x;//0: right, 1: down, 2: left, 3: up
	}
}


var Maze = function(length,width){

	
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
	var destination = new node(width-1,length-1);
	var nodes = createArray([width,length],0);
	var genMap = function(start,end,iter,top,bottom){//takes start node, end node, iteration, top left node, bottom right node
		if(start.col<top.col||start.row<top.row||start.col>end.col||start.row>end.row||nodes[start.row][start.col]!=0)
			return undefined;
		nodes[start.row][start.col]=iter;
		if(start.row==end.row&&start.col==end.col)
			return 0;
		var rand = new Rand();
		var x;
		do{
			var copy = new node();
			copy.col = start.col;
			copy.row = start.row;
			x = rand.get();
			switch(x){
				case 0://if right
					copy.col++;
					break;
				case 1://if down
					copy.row++;
					break;
				case 2://if left
					copy.col--;
					break;
				case 3://if up
					copy.row--;
					break;
				default://if undefined(meaning possibilities have been exhausted for this tree)
					//console.log("out of randoms");
					nodes[start.row][start.col]=0;
					return undefined;

			}
		}while(genMap(copy,end,iter+1,top,bottom) === undefined);
		return 0;
	};

	genMap(new node(0,0),new node(width-1,length-1),1,new node(0,0),new node(width-1,length-1) );
	console.log(nodes);

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