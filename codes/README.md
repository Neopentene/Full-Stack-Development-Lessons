# Code snippets used in lessons

## Xml Rules

- The root element is always the following `<codes></codes>`
- Javascript codes are surrounded by the following tag `<javascript></javascript>`
- Css styles are surrounded by the following tag `<css></css>`
- HTML codes are surrounded by the following tag `<rawhtml></rawhtml>`
- For any other type of code format the following tag is used `<render></render>`
- All the above tags have the attribute `for`. This attribute is used to find the id of the code element that will host the code written inside. Usage Example: `<css for="id-name"></css>`
- Remember that `<![CDATA[]>` is used for markup text

### Note

- Names of the xml files are the same as the lessons they are used in
- Also a custom data attribute is added on every body tag to locate the file in which the code snippets are kept. Usage Example: `<body data-file="xml-file-name"></body>`. The name must not contain the extension.
