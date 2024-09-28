const category = require('../models/categoryModels')

const categoryCtrl={
     getCategories:async(req,res)=>{
        try{
            const categories = await category.find();
            res.json(categories)
        }
        catch(err){
            return res.status(500).json({msg:err.message})
        }
     },
     createCategory:async(req,res)=>{
        try{
               const {name} = req.body;
               const category = await category.findOne({name})
               if(category) return res.status(400).json({msg:"Category Already exists"});
               const newCategory = new category({name})
               await newCategory.save();
               res.json('Admin success')
        }
        catch(err){
              return res.status(500).json({msg:err.message})
        }
     },
     deleteCategory:async(req,res)=>{
        try{
              await category.findByIdAndDelete(req.params.id)
              res.json({msg:"Deleted Category"});
        }
        catch(err){
            return res.status(500).json({msg:err.message})
        }
     },
     updateCategory:async(req,res)=>{
        try{
            const {name} = req.body;
            await category.findByIdAndUpdate({_id:req.params.id},{name})

            res.json({msg:"Updated"})
        }
        catch(err){
            return res.status(500).json({msg:err.message})
        }
     }
}
module.exports = categoryCtrl