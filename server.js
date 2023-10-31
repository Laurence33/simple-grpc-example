const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('todo.proto', {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;
(async () => {
  const server = new grpc.Server();

  server.bindAsync(
    '0.0.0.0:40000',
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log('listening on 0.0.0.0:40000');
      server.start();
    }
  );
  server.addService(todoPackage.Todo.service, {
    createTodo: createTodo,
    readTodos: readTodos,
    readTodoStream: readTodoStream,
  });

  const todos = [];
  function createTodo(call, callback) {
    console.log(call);
    const todoItem = {
      id: todos.length + 1,
      text: call.request.text,
    };
    todos.push(todoItem);
    callback(null, todoItem);
  }
  function readTodos(call, callback) {
    callback(null, { items: todos });
  }
  function readTodoStream(call, callback) {
    todos.forEach((t) => call.write(t));
    call.end();
  }
})();
