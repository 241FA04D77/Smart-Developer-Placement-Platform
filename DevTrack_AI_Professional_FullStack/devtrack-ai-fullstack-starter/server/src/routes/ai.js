import { Router } from 'express';
import auth from '../middleware/auth.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
const router=Router(); router.use(auth);
router.post('/insights/:projectId', async(req,res,next)=>{
 try{
  const project=await Project.findOne({_id:req.params.projectId,owner:req.userId}); if(!project)return res.status(404).json({message:'Project not found'});
  const tasks=await Task.find({project:project._id,owner:req.userId});
  const summary={total:tasks.length,done:tasks.filter(t=>t.status==='done').length,inProgress:tasks.filter(t=>t.status==='in-progress').length,open:tasks.filter(t=>t.status==='todo').length,highPriority:tasks.filter(t=>t.priority==='high'&&t.status!=='done').length};
  const prompt=`You are a concise project assistant. Project: ${project.name}. Description: ${project.description}. Task summary: ${JSON.stringify(summary)}. Tasks: ${tasks.map(t=>`${t.title} [${t.status}, ${t.priority}]`).join('; ')}. Give a short status summary and 3 practical next actions.`;
  let insight;
  if(process.env.OPENAI_API_KEY){
   const response=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',signal:AbortSignal.timeout(20000),headers:{'Content-Type':'application/json','Authorization':`Bearer ${process.env.OPENAI_API_KEY}`},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',messages:[{role:'user',content:prompt}],temperature:0.4})});
   if(!response.ok) throw new Error('AI provider request failed. Check the API key and provider configuration.'); const data=await response.json(); insight=data.choices?.[0]?.message?.content;
  } else {
   const pct=summary.total?Math.round(summary.done/summary.total*100):0;
   insight=`${project.name} is ${pct}% complete (${summary.done} of ${summary.total} tasks done). ${summary.highPriority} unfinished high-priority task(s) need attention. Next actions: (1) review high-priority open tasks, (2) move active work to done after verification, and (3) assign due dates to tasks without deadlines. Configure OPENAI_API_KEY to enable generated insights.`;
  }
  res.json({summary,insight,source:process.env.OPENAI_API_KEY?'ai-provider':'local-fallback'});
 }catch(e){next(e);}
});
export default router;
