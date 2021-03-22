export const groupTokenByName = (tokens) => {
     return tokens.reduce((acc, value) => {
        if (!acc[value.token_name]) {
          acc[value.token_name] = [];
        }
       
        acc[value.token_name].push(value);
       
        return acc;
      }, {})
}