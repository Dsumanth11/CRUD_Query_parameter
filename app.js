const express=require("express");
const {open}=require("sqlite");
const sqlite3=require("sqlite3");
const app=new express();
const path=require("path");
app.use(express.json());
let db=null;
app.get("/todos/",async(req,res)=>{
    let {status="",priority="",search_q=""}=req.query;
    status=status.replace("%20"," ");
    priority=priority.replace("%20"," ");
    search_q=search_q.replace("%20"," ");
    const query=
    `
    select *
    from todo
    where 
    status like '%${status}%'
    and priority like '%${priority}%' and
    todo like '%${search_q}%';
    `;
    const result=await db.all(query);
    res.send(result);
});

app.get("/todos/:todoId",async(req,res)=>{
    const {todoId}=req.params;
    const qur=`
    select *
    from todo
    where id=${todoId};
    `;
    const result=await db.get(qur);
    res.send(result);
});

app.post("/todos/",async(req,res)=>{
    try {
        const {todo,priority,status}=req.body;
        const qur=`
        insert into todo(todo,priority,status)
        values('${todo}','${priority}','${status}');
        `;
        await db.run(qur);
        res.send("Todo Successfully Added");
    } 
    catch (error) {
        console.log(error);
    }
});

app.put('/todos/:todoId',async(req,res)=>{
    try {
        let result="";
        const {status="",priority="",todo=""}=req.body;
        const {todoId}=req.params;
        let qu=`
        update todo
        set
            status='${status}'
        where id=${todoId}
        ;`;
        if(status!=="")
        {
            await db.run(qu);
            result="Status Updated";
        }
        qu=`
        update todo
        set
            priority='${priority}'
        where id=${todoId}
        ;`;
        if(priority!=="")
        {
            await db.run(qu);
            result="Priority Updated";
        }
        qu=`
        update todo
        set
            todo='${todo}'
        where id=${todoId}
        ;`;
        if(todo!=="")
        {
            await db.run(qu);
            result="Todo Updated";
        }
        res.send(result);
    } catch (err) {
        console.log(err);
    }
});

app.delete("/todos/:todoId",async(request,response)=>{
    try {
        const {todoId}=request.params;
        const que=`
        delete from todo
        where id=${todoId};`;
        await db.run(que);
        response.send("Todo Deleted");
    } 
    catch (error) {
        console.log(error);
    }
});
const initializeDBandServer=async()=>{
    try 
    {
        db=await open({
            filename:path.join(__dirname,"todoApplication.db"),
            driver:sqlite3.Database
        });
        app.listen(3000,()=>{
            console.log("server running at http://localhost:3000");
        })
    }
    catch (error) {
        console.log(error);
    }

}

initializeDBandServer();

module.exports=app;