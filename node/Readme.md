
# odata

  Javascript oData api client

## API

- OData
- Model
  - [mixin()](#mixin)
  - [.each()](#eachfnfunction)
  - [.pull()](#pulllimitnumber)
  - [.map()](#mapfnfunction)
  - [.select()](#selectfnfunctionstring)
  - [.unique()](#unique)
  - [.reject()](#rejectfnfunctionstringmixed)
  - [.compact()](#compact)
  - [.find()](#findfnfunction)
  - [.findLast()](#findlastfnfunction)
  - [.none()](#nonefnfunctionstring)
  - [.any()](#anyfnfunction)
  - [.count()](#countfnfunction)
  - [.indexOf()](#indexofobjmixed)
  - [.has()](#hasobjmixed)
  - [.reduce()](#reducefnfunction-valmixed)
  - [.max()](#maxfnfunctionstring)
  - [.sum()](#sumfnfunctionstring)
  - [.first()](#firstnnumberfunction)
  - [.last()](#lastnnumberfunction)
  - [.inGroupsOf()](#ingroupsofnnumber)
  - [.at()](#atinumber)
  - [.value()](#value)

## OData(url, path, options)

Create a new odata instance

```js
  // Basic instance
  var odata = OData('http://odata-example.com/test.srv');

  // instance for set resource path
  var odataResource = OData('http://odata-example.com/test.srv', 'Category(1)/Products');

  // instance with simple auth options
  var odataWithAuth = OData('http://odata-example.com/test.srv', {user:'test', password:'test'});
```

## odata.resource(path)

Create a resource specific odata instance with base instance settings.

```js
  // create resource specific odata instance from base instance
  var product = odata.resource('Category(1)/Products');
```

## odata.get(opts, fn)

Make a query request with the odata instance (base or resource) and receive a callback.
If no callback is supplied the request is returned.

```js
  // set request data
  var data = {
    path: 'Category(1)/Products',
    format: 'json'  // default
    query: {
      '$top' : 2,
      '$orderby': 'PRICE'
    }
  }

  // request using base instance
  odata.get(data, function (err, res) {
    console.log(err, res);
  });

  // pipe response to stdout
  odata.get(data).pipe(process.stdout);

  // set request data
  var rdata = {
    format: 'json'  // default
    query: {
      '$top' : 2,
      '$orderby': 'PRICE'
    }
  }

  // request using resource specific instance
  product.get(rdata, function (err, res) {
    console.log(err, res);
  });

  // pipe response to stdout
  product.get(rdata).pipe(process.stdout);

```

## odata.add(opts, fn)

Make a request to add an entry with the odata instance (base or resource) and receive a callback.
If no callback is supplied the request is returned.

```js
  // set request data
  var data = {
    path: 'Category(1)/Products',
    format: 'json',  // default
    data: {
      'name' : 'test',
      'description': 'some info'
    }
  }

  // request using base instance
  odata.add(data, function (err, res) {
    console.log(err, res);
  });

  // pipe response to stdout
  odata.add(data).pipe(process.stdout);

  // set request data
  var rdata = {
    format: 'json'  // default
    data: {
      'name' : 'test',
      'description': 'some info'
    }
  }

  // request using resource specific instance
  product.add(rdata, function (err, res) {
    console.log(err, res);
  });

  // pipe response to stdout
  product.add(rdata).pipe(process.stdout);

```

## odata.remove(opts, fn)

Make a request to remove an entry with the odata instance (base or resource) and receive a callback.
If no callback is supplied the request is returned.

```js
  // set request data
  var data = {
    path: 'Category(1)/Products',
    format: 'json'  // default
  }

  // request using base instance
  odata.remove(data, function (err, res) {
    console.log(err, res);
  });

  // pipe response to stdout
  odata.remove(data).pipe(process.stdout);

  // set request data
  var rdata = {
    format: 'json'  // default
  }

  // request using resource specific instance
  product.remove(rdata, function (err, res) {
    console.log(err, res);
  });

  // pipe response to stdout
  product.remove(rdata).pipe(process.stdout);

```

## odata.update(opts, fn)

Make a request to update an entry with the odata instance (base or resource) and receive a callback.
If no callback is supplied the request is returned.

```js
  // set request data
  var data = {
    path: 'Categories/Products(1)',
    format: 'json',  // default
    data: {
      'name' : 'test',
      'description': 'some info'
    }
  }

  // request using base instance
  odata.update(data, function (err, res) {
    console.log(err, res);
  });

  // pipe response to stdout
  odata.update(data).pipe(process.stdout);

  // set request data
  var rdata = {
    format: 'json'  // default
    data: {
      'name' : 'test',
      'description': 'some info'
    }
  }

  // request using resource specific instance
  product.update(rdata, function (err, res) {
    console.log(err, res);
  });

  // pipe response to stdout
  product.update(rdata).pipe(process.stdout);

```
## Model

  Model mixin.

```js
users
  .map('friends')
  .select('age > 20')
  .map('name.first')
  .select(/^T/)
```

### mixin()

  Mixin to `obj`.

```js
 var Model = require('model');
 Model(Something.prototype);
```

### .each(fn:Function)

  Iterate each value and invoke `fn(val, i)`.

```js
 users.each(function(val, i){

 })
```

### .pull(limit:Number)

  Return next set from last index to `limit`.

```js
 users.pull(5);
```

### .map(fn:Function)

  Map each return value from `fn(val, i)`.

  Passing a callback function:

```js
 users.map(function(user){
   return user.name.first
 })
```


  Passing a property string:

```js
 users.map('name.first')
```

### .select(fn:Function|String)

  Select all values that return a truthy value of `fn(val, i)`.

```js
 users.select(function(user){
   return user.age > 20
 })
```


   With a property:

```js
 items.select('complete')
```

### .unique()

  Select all unique values.

```js
 nums.unique()
```

### .reject(fn:Function|String|Mixed)

  Reject all values that return a truthy value of `fn(val, i)`.

  Rejecting using a callback:

```js
 users.reject(function(user){
   return user.age < 20
 })
```


  Rejecting with a property:

```js
 items.reject('complete')
```


  Rejecting values via `==`:

```js
 data.reject(null)
 users.reject(toni)
```

### .compact()

  Reject `null` and `undefined`.

```js
 [1, null, 5, undefined].compact()
 // => [1,5]
```

### .find(fn:Function)

  Return the first value when `fn(val, i)` is truthy,
  otherwise return `undefined`.

```js
 users.find(function(user){
   return user.role == 'admin'
 })
```

### .findLast(fn:Function)

  Return the last value when `fn(val, i)` is truthy,
  otherwise return `undefined`.

```js
 users.findLast(function(user){
   return user.role == 'admin'
 })
```

### .none(fn:Function|String)

  Assert that none of the invocations of `fn(val, i)` are truthy.

  For example ensuring that no pets are admins:

```js
 pets.none(function(p){ return p.admin })
 pets.none('admin')
```

### .any(fn:Function)

  Assert that at least one invocation of `fn(val, i)` is truthy.

  For example checking to see if any pets are ferrets:

```js
 pets.any(function(pet){
   return pet.species == 'ferret'
 })
```

### .count(fn:Function)

  Count the number of times `fn(val, i)` returns true.

```js
 var n = pets.count(function(pet){
   return pet.species == 'ferret'
 })
```

### .indexOf(obj:Mixed)

  Determine the indexof `obj` or return `-1`.

### .has(obj:Mixed)

  Check if `obj` is present in this model.

### .reduce(fn:Function, [val]:Mixed)

  Reduce with `fn(accumulator, val, i)` using
  optional `init` value defaulting to the first
  model value.

### .max(fn:Function|String)

  Determine the max value.

  With a callback function:

```js
 pets.max(function(pet){
   return pet.age
 })
```


  With property strings:

```js
 pets.max('age')
```


  With immediate values:

```js
 nums.max()
```

### .sum(fn:Function|String)

  Determine the sum.

  With a callback function:

```js
 pets.sum(function(pet){
   return pet.age
 })
```


  With property strings:

```js
 pets.sum('age')
```


  With immediate values:

```js
 nums.sum()
```

### .first([n]:Number|Function)

  Return the first value, or first `n` values.

### .last([n]:Number|Function)

  Return the last value, or last `n` values.

### .inGroupsOf(n:Number)

  Return values in groups of `n`.

### .at(i:Number)

  Return the value at the given index.

### .value()

  Return the model value.
