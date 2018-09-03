const moment = require('moment');
module.exports = {
  truncate: function(str, len){
    if (str.length > len && str.length > 0) {
			var new_str = str + " ";
			new_str = str.substr(0, len);
			new_str = str.substr(0, new_str.lastIndexOf(" "));
			new_str = (new_str.length > 0) ? new_str : str.substr(0, len);
			return new_str + '...';
		}
		return str;
  },
  stripTags: function(input){
    return input.replace(/<(?:.|\n)*?>/gm, '');
  },
  select: function(selected, options){
    return options.fn(this).replace( new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace( new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
  },
  formatDate: function(date , format){
      return moment(date).format(format);
  },
  paginate: function(options){
      let output = '';
      if(options.hash.current === 1){
        output += `<li class='page-item disabled'><a class='page-link'>First</a></li>`;
      }else{
        output += `<li class='page-item'><a href='?page=1' class='page-link'>First</a></li>`;
      }

      let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 4 : 1);
      if(i !== 1){
          output += `<li class='page-item disabled'><a class='page-link'>...</a></li>`
      }

      for(;i <= (Number(options.hash.current)) + 4 && (i <= options.hash.pages) ; i++){
          if(i === options.hash.current){
             output += `<li class='page-item active'><a class='page-link'>${i}</a></li>`;
          }else{
            output += `<li class='page-item'><a href='?page=${i}' class='page-link'>${i}</a></li>`;
          }

          if(i === Number(options.hash.current) + 4 && i < options.hash.pages){
                output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
            }
      }

      if(options.hash.current === options.hash.pages){
        output += `<li class='page-item disabled'><a class='page-link'>Last</a></li>`;
      }else{
        output += `<li class='page-item'><a href='?page=${options.hash.pages}' class='page-link'>Last</a></li>`;
      }
      return output;
  }

}
