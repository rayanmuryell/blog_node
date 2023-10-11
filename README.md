![Tela inicial do projeto](https://i.imgur.com/ZO3uxLq.png "Tela inicial do projeto")

------------



# Blog em NODEJS
Sistema feito para por em prática os aprendizados em Node, Express, MongoDB, Mongoose. Este foi um dos meus primeiros projetos, mas que serviu de bastante aprendizado.

## Algumas opções dentro do projeto:

1. Cadastrar novas categorias;
2. Realizar novas publicações e definir uma categoria para a publicação;
3. Cadastro de usuários e permissões - administradores ou usuários.


## Como baixar:

> **git clone** https://github.com/rayanmuryell/blog_node.git

> **cd** blog_node

> **npm install**

Será necessário também a utilização do **MONGODB**:
https://www.mongodb.com/


------------



## Banco de Dados:

Após a instalação, você precisará criar um banco de dados dentro do MONGODB chamado **blogapp** e as collections **categorias**, **postagens**, **usuarios**.


------------

## Iniciando o projeto:


Com tudo configurado e com o banco de dados ativo e funcionando, basta acessar a pasta raiz do projeto e iniciar o serviço:
> **node** app.js

Se tudo der certo, você receberá a seguinte mensagem dentro do console:

>Servidor sendo utilizado na porta 8081

>Conectado ao banco de dados do MONGODB

A partir deste momento você já estará disponível para acessar o projeto através do seu navegador pelo link: http://localhost:8081/


------------

## Usuários e permissões:

Como já esperado: não há publicações, categorias e nem usuários. :tw-1f605:
Crie sua conta e edite as permissões deste usuário dentro da collection usuarios.

> eAdmin: 0 (Usuário comum)

> eAdmin: 1 (Administrador)

Caso tenha optado em adicionar o valor 1 (administrador), você já poderá acessar o painel administrativo através do link:
http://localhost:8081/admin/

Será possível adicionar novas publicações, categorias e editar o nível de permissão de novos usuários que venham surgir, sem a necessidade de mexer diretamente no banco de dados.


------------

## Considerações finais:


Como já dito anteriormente, este é um projeto bem inicial e que me fez entender um pouco das ferramentas utilizadas no mercado e como as interações entre frontend e backend funcionam.
Caso queira fazer qualquer tipo de edição, inclusão, ou até mesmo correções... **sinta-se livre!**
Basta enviar para este mesmo repositório as suas modificações e eu ficarei feliz em ver o que foi feito.

Obrigado por ter lido até aqui.



