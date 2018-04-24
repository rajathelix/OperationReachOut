function check(input) {
    if (input.validity.typeMismatch) {
      input.setCustomValidity(input.value + " is not a valid "+input.id );
   } else {
      // input is fine -- reset the error message
      input.setCustomValidity("");
    }
  }
  function phonecheck(input){
    var phoneno = /^\d{10}$/;
    if(input.value.match(phoneno)){
      input.setCustomValidity("");
    }
    else{
      input.setCustomValidity("Enter a valid Mobile Number");
    }
  }
