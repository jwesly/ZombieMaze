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
	this.col = col;}

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
	}}

var Maze = function(length,width){
	if(length === undefined || width === undefined){
		console.error("A maze requires length and width")
	}
	this.length = length + 1;
	this.width = width + 1;
	this.walls = createArray([this.width,this.length],{top: false,left: false});
	for(var i=0;i<this.length-1;i++){
		this.walls[0][i].top = true;
		this.walls[this.width-1][i].top = true;
	}
	for(var j=0;j<this.width-1;j++){
		this.walls[j][0].left = true;
		this.walls[j][this.length-1].left = true;
	}
	
	this.walls[0][0].left = false;
	this.walls[this.width-2][this.length-1].left = false;
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

	genMap(new node(0,0),new node(width-1,length-1),2,new node(0,0),new node(width-1,length-1) );//minor glitch if iter=1
	var that = this;
	var drawMap = function(){//this doesn't have to be a function but i like functions
		for(i=0;i<width;i++){
			for(j=0;j<length;j++){
				var t = nodes[i][j];//saves some typing and time
				if(t!=0){
					if(i-1>=0 && nodes[i-1][j]+1!=t && nodes[i-1][j]-1!=t)//up
						that.walls[i][j].top = true;
					if(i+1<width && nodes[i+1][j]+1!=t && nodes[i+1][j]-1!=t)//down
						that.walls[i+1][j].top = true;
					if(j-1>=0 && nodes[i][j-1]+1!=t && nodes[i][j-1]-1!=t)//left
						that.walls[i][j].left = true;
					if(j+1<length && nodes[i][j+1]+1!=t && nodes[i][j+1]-1!=t)//right
						that.walls[i][j+1].left = true;
				}
				//console.log(i-1>=0 && nodes[i-1][j]+1!=t && nodes[i-1][j]-1!=t,i+1<width && nodes[i+1][j]+1!=t && nodes[i+1][j]-1!=t,j-1>=0 && nodes[i][j-1]+1!=t && nodes[i][j-1]!=t,j+1<length && nodes[i][j+1]+1!=t && nodes[i][j+1]-1!=t)
			}
		}
	}
	drawMap();

}

Maze.prototype.display = function(){
	var line;
	for(var i=0; i < this.width+1; i++){
		line = "";
		for(var j = 0; j < this.length; j++){
			if(i > 0 && this.walls[i-1][j].left===true)
				line+="|";
			else
				line+=" ";
			if( i < this.width && this.walls[i][j].top===true)
				line+="_";
			else
				line+=" "
		}
		console.log(line);
	}
}

//var m = new Maze(8,8);
//m.display();