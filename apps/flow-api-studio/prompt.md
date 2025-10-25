Preciso de uma aplicação para criar apis no estilo open api
Tenho duas personas para a aplicação Editor e Visualizador
Crie uma forma de u eu poder testar com os dois tipos de personas
Cada persona deve ter acesso somente a sua funcionalidade:

1 - Editor:
Cria, edita,exclui e visualiza as apis
Cria, edita,exclui e visualiza os endpoints
Cria, edita,exclui e visualiza os dados de testes do endpoint
Cria, edita,exclui e visualiza e executa os use cases os use cases
Os use cases são fluxos possíveis de execução da api, ele deve ser uma tela estilo dashboard drag and drop de criação de fluxos, tendo nós que são endpoint e conectores, em um sistema de conexões, que são a indicação de qual o próximo endpoint e nele tem a descrição dos paramentros da resposta do endpoint que devem ser passados para o próximo endpoint
No use case coloque um botão no card do endpoint para que seja possivel editar o endpoint, ou seja deve navegar para a tela de edição do endpoint atravez da tela de use case
Deve ser possivel fazer o vinculo entre os paramentos de saida do endpointa anterior com os paramentros de entrada do próximo endpoint, tudo de forma visual drag and drop.
Faça o sistema de conexão com drag e drop, no edior de use cases, em que eu clico sobre um card de endpoint e arrato até outro card e o conector é criado. No meio do connector coloque um card que mostra a lista de parametros que sera passado de um endpoint para outro. Preciso que seja possível editar os parametros passados. O parametros a ser passados só podem ser parametros de saida(response) do endpoint de origem
Na execução do use case o sistema deve executar os endpoints seguindo a sequencia estabelecida no fluxo, passando os paramentros entre os endpoints conforme configuração dos conectores

2 - Visualizador:
Visualiza as apis
Visualiza os endpoints
Visualiza os use cases
Executa os use cases
