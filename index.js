const express = require('express');
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const user = require('./model/user');
const path = require('path');
const bcrypt = require('bcrypt');
const rate1 = require('./model/rate1.js')
const rate2 = require('./model/rate2.js')
const rate3 = require('./model/rate3.js')

//connecting mongoose

mongoose.connect("mongodb+srv://project:project@cluster0.s80ou.mongodb.net/la4?retryWrites=true&w=majority",{useCreateIndex:true,
useUnifiedTopology:true,useNewUrlParser:true}, function(err,data){
    if(err){
        console.log("DB connect fail");
    }
    if(data){
        console.log("DB coneect success");
    }
});

//main code

let logged = false;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//setting up view library
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'./views'));


//routes for links

app.get('/register',function(req,res){
    res.render('register',{'error':'','success':''});
});

app.post('/register',function(req,res){
    var {email,username,psw,psw_repeat } = req.body;
    if(!email || !username || !psw || !psw_repeat){
        res.render('login',{'error':'Please Fill fields','success':''});

    }
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(psw, salt, function(err, hash) {
            hashPass = hash;
            const User = new user({
                email:email,
                username:username,
                password:hashPass
            }).save(function(err,data){
                if(err){
                    console.log(err);
                    res.render('login',{'error':'Please Try again','success':''});
                }
                else{
                    console.log("user created");
                    res.render('login',{'error':'','success':'Registerd successfully'});
                }
            });
        });
    });
 
});

//Login
app.get('/login',function(req,res){
    res.render('login',{'error':'','success':''});
});
app.post('/login',function(req,res){
    var { email,psw} = req.body;
    app.set('email',email);
    if(!email || !psw){
        res.render('login',{'error':'empty feilds',"success":''})
    }
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(psw, salt, function(err, hash) {
            hashPass = hash;
            user.findOne({email:email},function(err,data){
                if(err)
                {
                    console.log("Login error");
                    res.render('login',{'error':'No user','success':''});
        
                }if(data){
                    if(data.psw == hashPass){
                        console.log("ljflsfalksjflkaflkj");
                    }
                    logged = true;
                    app.set('logged',logged);
                    res.render('index',{'logged':logged,'error':'','success':''});

                }
                else{
                    res.render('login',{'error':'','success':''});
                }
            });
        });
    });



});

//rate
app.get('/blog1/rate',function(req,res){
    let log = app.get('logged');

    rate1.find(function(err,rdata){

        res.render('blog1',{'logged':log,'rating':rdata,'rates':true,'error':'','success':''});
    });
});
app.get('/blog2/rate',function(req,res){
    let log = app.get('logged');

    rate2.find(function(err,rdata){

        res.render('blog2',{'logged':log,'rating':rdata,'rates':true,'error':'','success':''});
    });
});
app.get('/blog3/rate',function(req,res){
    let log = app.get('logged');

    rate3.find(function(err,rdata){

        res.render('blog3',{'logged':log,'rating':rdata,'rates':true,'error':'','success':''});
    });
});
app.post('/blog1/rate',function(req,res){
    var {rate,feed} = req.body;
    let log = app.get('logged');
    let mail  = app.get('email');
    if(log){
        const Rate1 = new rate1({
            email:mail,
            rate:rate,
            feedback:feed
        }).save(function(err,data){
            if(err){
                console.log("error");
                res.render('blog1',{'logged':log,'rating':'','rates':true,'error':'','success':''});
    
            }
            if(data){
                rate1.find(function(err,rdata){
    
                    res.render('blog1',{'logged':log,'rating':rdata,'rates':true,'error':'','success':''});
                });              
            }
        });
    }
    else{
        res.render('login',{'error':'','success':''});
    }
});
app.post('/blog2/rate',function(req,res){
    var {rate,feed} = req.body;
    let log = app.get('logged');
    let mail  = app.get('email');
    if(log){
        const Rate2 = new rate2({
            email:mail,
            rate:rate,
            feedback:feed
        }).save(function(err,data){
            if(err){
                console.log("error");
                res.render('blog2',{'logged':log,'rating':'','rates':true,'error':'','success':''});
    
            }
            if(data){
                rate2.find(function(err,rdata){
    
                    res.render('blog2',{'logged':log,'rating':rdata,'rates':true,'error':'','success':''});
                })                }
        });
    }
    else{
        res.render('login',{'error':'','success':''});
    }

});
app.post('/blog3/rate',function(req,res){
    var {rate,feed} = req.body;
    let log = app.get('logged');
    let mail  = app.get('email');
    if(log){
        const Rate3 = new rate3({
            email:mail,
            rate:rate,
            feedback:feed
        }).save(function(err,data){
            if(err){
                console.log("error");
                res.render('blog3',{'logged':log,'rating':'','rates':true,'error':'','success':''});
    
            }
            if(data){
                rate3.find(function(err,rdata){
    
                    res.render('blog3',{'logged':log,'rating':rdata,'rates':true,'error':'','success':''});
                })
            }
        });
    }
    else{
        res.render('login',{'error':'','success':''});
    }

});

app.get('/',function(req,res){
    let log = app.get('logged');

    res.render('index',{'logged':log});
});

app.get('/blog1',function(req,res){
    let log = app.get('logged');
    rate1.find(function(err,rdata){

        if(err){

            res.render('blog1',{'logged':log,'rating':'','rates':true,'error':'','success':''});
        }
        if(rdata){

            res.render('blog1',{'logged':log,'rating':rdata,'rates':true,'error':'','success':''});
        }
    })
});
app.get('/blog2',function(req,res){
    let log = app.get('logged');
    rate2.find(function(err,rdata){
        if(err){

            res.render('blog2',{'logged':log,'rating':'','rates':true,'error':'','success':''});
        }
        if(rdata){
            res.render('blog2',{'logged':log,'rating':rdata,'rates':true,'error':'','success':''});

        }
    })
});
app.get('/blog3',function(req,res){
    let log = app.get('logged');
    rate3.find(function(err,rdata){
        if(err){

            res.render('blog3',{'logged':log,'rating':'','rates':true,'error':'','success':''});
        }
        if(rdata){
            res.render('blog3',{'logged':log,'rating':rdata,'rates':true,'error':'','success':''});

        }
    })
});

//logout
app.get('/logout',function(req,res){
    logged = false;
    app.set('logged',logged);
    res.render('index',{'logged':logged,'error':'','success':''});
})


app.listen(8002,function(){
    console.log("server started at 8002");
})