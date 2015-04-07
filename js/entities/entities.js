 game.PlayerEntity = me.Entity.extend({
 	init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
            image: "player",
            width: 64,
            height: 64,
            spritewidth:"64",
            spriteheight:"64",
            getShape: function (){
            	return(new me.Rect(0, 0, 64, 64)).toPolygon ();
            }
        }]);
        this.type = "PlayerEntity";
        this.health = game.data.playerHealth;
        this.body.setVelocity(game.data.playerMoveSpeed, 10);    
        this.body.setVelocity(game.data.playerJumpHeight, 19);
        this.facing = "right";
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.dead = false;
        this.attack = game.data.playerAttack;
        this.lastAttack = new Date().getTime();
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        this.renderable.addAnimation("idle", [78] );
   		  this.renderable.addAnimation("walk", [117, 118, 119, 120, 123, 124, 125], 80);
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
        this.renderable.setCurrentAnimation("idle")
 },

        update: function(delta){
              this.now = new Date().getTime();

              //this.dead = checkIfDead ();

              this.checkKeyPressedAndMove();
               
                
           
         
           if (me.input.isKeyPressed("attack")) {
                  if(!this.renderable.isCurrentAnimation("attack")){
                   //console.log(!this.renderable.isCurrentAnimation("attack"))
                  console.log()
                    //this sets the attack to go back to the idle  position  
                  this.renderable.setCurrentAnimation("attack", "idle");
 
                  this.renderable.setAnimationFrame();
              }
          }
           
           else if(this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")){
          
           if(!this.renderable.isCurrentAnimation("walk")){
            this.renderable.setCurrentAnimation("walk");
        	
             }
          
           }else if(!this.renderable.isCurrentAnimation("attack")){
          	 this.renderable.setCurrentAnimation("idle");
           }
          
          me.collision.check(this, true, this.collideHandler.bind(this), true);
          this.body.update(delta);
         
          this._super(me.Entity, "update", [delta]);
          return true;
      },
 
        checkIfDead: function(){
          if (this.health <= 0){
              return true;
           }
           return false;
        },
             checkKeyPressedAndMove: function(){
           if(me.input.isKeyPressed("right")) {
                this.moveRight();
           }else if (me.input.isKeyPressed("left")){
               this.moveLeft();
           }else{
               this.body.vel.x = 0;
          }

           if(me.input.isKeyPressed("jump") && !this.body.jumping && !this.body.falling){
              this.jump();
          }
       },

          moveRight: function(){
                 //console.log("right");s
                //sets the position of my x by adding the velocity defined above
               //setVelocity() and multiplying it by me .timer.tick.
              //me.timer.tick makes movement look smooth
      
               this.body.vel.x += this.body.accel.x * me.timer.tick;
               this.facing = "right";
               this.flipX(true);
           },
           moveLeft: function(){
               this.body.vel.x -=this.body.accel.x * me.timer.tick;
               this.facing = "left";
               this.flipX(false);
           },            

          loseHealth: function(damage){
          this.health = this.health - damage;
          console.log(this.health);
       },
     
          jump: function(){
              this.body.jumping = true;
              this.body.vel.y -=this.body.accel.y * me.timer.tick;

          },

          collideHandler: function(response){
    	    if(response.b.type==='EnemyBaseEntity'){
    		      var ydif = this.pos.y - response.b.pos.y;
    	         var xdif = this.pos.x - response.b.pos.x;
    
          console.log("xdif " + xdif + "ydif " + ydif);
         
          if (ydif<-40 && xdif< 70 && xdif>-35){
 		      this.body.falling = false;
 		      this.body.vel.y = -1;
            }
          
          else if (xdif>-35 && this.facing==='right' && (xdif<0)) {
         	   this.body.vel.x = 0;
         	   //this.pos.x = this.pos.x -1;
             
          }else if(xdif<70 && this.facing==='left' && xdif>0){
              this.body.vel.x = 0;
              //this.pos.x = this.pos.x +1;
            }

          if (this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer){
              console.log("tower Hit");
              this.lastHit = this.now;
              response.b.loseHealth(game.data.playerAttack);
            }
          }else if(response.b.type==='EnemyCreep'){
                var xdif = this.pos.x - response.b.pos.x;
                var ydif = this.pos.y - response.b.pos.y;

          if (xdif>0){
              //this.pos.x = this.pos.x + 1;
                if(this.facing==="left"){
                  this.body.vel.x = 0;
             }
        
          }else{
            //  this.pos.x = this.pos.x - 1;
              if(this.facing==="right"){
                this.body.vel.x = 0;
            }

          if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer
                     && (Math.abs(ydif <= 40) && 
                     (((xdif>0) && this.facing==="left") || ((xdif<0) && this.facing==="right"))
                      )){
                 this.lastHit = this.now;
               //if the creeps health is less than our attack,exicute code if statement 
                 if(response.b.health <= game.data.playerAttack){

                    game.data.gold += 1;
                    console.log("Current Gold: " + game.data.gold);
                 }
                 console.log(response.b.health);
                 response.b.loseHealth(game.data.playerAttack);
               }
            } 
          }
        }
      });

         