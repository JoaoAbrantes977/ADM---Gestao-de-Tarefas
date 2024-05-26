const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    id_user: {
        type: Number, // Alterado para Number
        // Não é mais necessário definir aqui, será gerado automaticamente
      },
      title: {
        type: String,
        //required: true
      },
      description: {
        type: String,
        //required: true
      },
      startDate: {
        type: String,
        //required: true
      },
      finishedDate: {
        type: String,
        //required: true
      },
      task: {
        type: String,
        required: true
      },
      created_at: {
          type: Date,
          default: Date.now()
      },
    }, { timestamps: true });

// Lógica para gerar o id_user sequencial
TodoSchema.pre('save', async function(next) {
    if (!this.isNew) return next();

    try {
        const maxUserId = await this.constructor.findOne({}, { id_user: 1 }, { sort: { id_user: -1 } });
        this.id_user = maxUserId ? maxUserId.id_user + 1 : 1;
        next();
    } catch (error) {
        next(error);
    }
});

const TodoModel = mongoose.model('Todo', TodoSchema);

module.exports = TodoModel;


module.exports = Todo = mongoose.model('todos', TodoSchema);
