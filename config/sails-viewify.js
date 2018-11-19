// Example config
//
// module.exports = {
//   template: [
//     {
//       type: 'text',
//       htmltext: '<p>type of {{name}} is {{type}}</p>',
//       specials: [
//         {
//           text: '{{name}}',
//           replacer: 'name'
//         },
//         {
//           text: '{{type}}',
//           replacer: 'type'
//         }
//       ]
//     }
//   ]
// };

module.exports = {

  template : [
    {
      type : 'string' ,
      htmltext :
        '<div class="form-group">\n' +
        '    <label class="control-label" for="{{name}}">{{name}}: </label>\n' +
        '    <input class="form-control" id="{{name}}" type="text" value="<%= {{name}} %>"/>\n' +
        '</div>\n',
      specials : [
        {
          text : '{{name}}' ,
          replacer : 'name'
        },
        {
          text : '{{type}}' ,
          replacer : 'type'
        }
      ]
    }
  ]

};
