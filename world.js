/****************************************************

Assumes maze.js and three.js are included. Sets up the 3D world

****************************************************/

var World = function(maze){
	if(maze === undefined){
		console.error("This World MUST Have a Maze")
		return;
	}
	var that = this;
	this.scale = 100;
	this.wWidth = 20;//sets wall width

	this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
	this.camera.position.z = 500;
	this.controls = new THREE.OrbitControls( this.camera );
	window.addEventListener('resize',function(){
		that.camera.aspect = window.innerWidth/window.innerHeight;
		that.camera.updateProjectionMatrix();
		that.renderer.setSize(window.innerWidth,window.innerHeight);
		that.render();
	})

	this.scene = new THREE.Scene();
	this.scene.add(this.camera);
	
	var cubeGeometry = new THREE.BoxGeometry(10,10,10);
	var cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x1ec876 });
	var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	this.scene.add(cube);
	//var sphere = new THREE.Mesh(new THREE.SphereGeometry(50,16,16),new THREE.MeshLambertMaterial({color: 0xCC0000}));
	//this.scene.add(sphere);
//var geometry = new THREE.PlaneBufferGeometry( 200,200 );
//console.log(geometry);
var geo,plane;
var mat = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
//this.scene.add( plane );
	var addMaze = function(){
		maze.display();
		for(i=0;i<maze.width;i++){
			for(j=0;j<maze.length;j++){
				if(maze.walls[i][j].left){
					//add a planeBufferGeometry
					geo = new THREE.BoxGeometry(that.scale,that.scale,that.wWidth);
					plane = new THREE.Mesh(geo,mat);
					plane.position.set(that.scale*j,that.scale*.5,that.scale*i+that.scale*.5);
					plane.rotation.y = Math.PI/2;
					that.scene.add(plane);
					
				}
				if(maze.walls[i][j].top){
					//add a plane
					geo = new THREE.BoxGeometry(that.scale,that.scale,that.wWidth);
					plane = new THREE.Mesh(geo,mat);
					
					plane.position.set(that.scale*j+that.scale*.5,that.scale*.5,that.scale*i);
					that.scene.add(plane);
				}
			}
		}
	}
	addMaze();

	var texture = THREE.ImageUtils.loadTexture('floor.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.x = 20;
        texture.repeat.y = 20;
var f1,f2,floor;

        f1 = new THREE.PlaneGeometry(this.scale*(maze.length-1),this.scale*(maze.width-1));
        f2 = new THREE.MeshBasicMaterial({color:0x0000ff, wireframe: false,  side:THREE.DoubleSide});
        floor = new THREE.Mesh(f1,f2);
        floor.position.set(this.scale*(maze.length-1)*.5,0,this.scale*(maze.width-1)*.5);
        floor.rotation.x = Math.PI / 2;

        this.scene.add(floor);

	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(this.renderer.domElement);
	this.controls.addEventListener( 'change', function(){that.animate();} );
	this.animate();
}

World.prototype.render = function(){
	this.renderer.render( this.scene, this.camera );
}

World.prototype.animate = function(){
	var that = this;
    //window.requestAnimationFrame(function() { that.animate(); });
    //do some animations (zombie movements)
    this.render();
}