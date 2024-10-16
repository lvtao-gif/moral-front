function alertBox(message,type,that,title) {
  if(type =="success"){
      that.$message({
          showClose: true,
          message: message,
          type: 'success',
          duration: 2000
        });
  }
  else if(type == "warning"){
    that.$message({
      message: message,
      type: 'warning',
      duration: 2000
    });
  }
  else if(type =="info"){
    that.$message({
      showClose: true,
      message: message,
      duration: 2500
    });
  }
  else if(type =="error"){
    that.$alert(message, title, {
      confirmButtonText: '确定',
    });
  }else if(type == "error_msg"){
    that.$message({
      message: message,
      type: 'error',
      duration: 2000
    });
  }
}

export{alertBox}
