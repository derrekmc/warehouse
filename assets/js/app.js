// class ViewController{
//
//   constructor(formId){
//     this.parentId = formId;
//     let btn = document.getElementById(formId);
//     btn.addEventListener('click', this.save)
//   }
//
//   save(event){
//       console.log("button pressed:", this.id, event.target.name);
//       event.preventDefault();
//   }
//
//   update(data){
//
//     for(var i in data){
//       switch(typeof data[i]){
//         case "boolean":
//           console.log("boolean:", data[i]);
//           break;
//         case "string":
//           console.log("string:", data[i]);
//           document.getElementById(this.parentId);
//           break;
//         case "number":
//           console.log("number:", data[i]);
//           break;
//         case "object":
//           console.log("object:",i, data[i]);
//           this.update(data[i]);
//           break;
//         case "array":
//           console.log("array:", data[i]);
//           break;
//         default:
//           console.log("No Type:", i, data[i]);
//       }
//     }
//   }
// }
//
// var model = {
//   upc: "432345",
//   status: "available",
//   warehouse: "warehouse",
//   id: 1,
//   clips: {
//     "derre": {
//       name: "derre1"
//     }
//   }
// };

// var view = new ViewController("createView");
//     view.update(model);
