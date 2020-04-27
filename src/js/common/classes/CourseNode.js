export default class CourseNode {
  constructor({ name, prerequisites = [], title, subject, catalogNumber }) {
    this.name = name;
    this.title = title;
    this.subject = subject;
    this.catalogNumber = catalogNumber;
    this.prerequisites = prerequisites;
  }

  getPrerequisites() {
    return this.prerequisites;
  }

  getName() {
    return this.name;
  }

  toJSON() {
    return {
      name: this.name,
      title: this.title,
      subject: this.subject,
      catalogNumber: this.catalogNumber
    };
  }

  removePrerequisite(target) {
    // dfs to find the target, then remove
    const stack = [[this.prerequisites, null]];
    const preOrder = [];
    let found = false;

    while (stack.length > 0) {
      const [node, parent] = stack.pop();
      const isOr = node[0] === 1;

      preOrder.push([node, parent]);

      for (let item of node) {
        if (item === 1) continue;

        if (item === target) {
          if (isOr) node.splice(0);
          else node.splice(node.indexOf(item), 1);

          found = true;
          break;
        }

        if (item instanceof Array) stack.push([item, node]);
      }

      if (found) break;
    }

    while (preOrder.length > 0) {
      const [node, parent] = preOrder.pop();

      if (node.length === 0) {
        if (parent === null) continue;
        if (parent[0] === 1) parent.splice(0);
        else parent.splice(parent.indexOf(node), 1);
      }
    }
  }

  isFulfilled() {
    return this.prerequisites.length === 0;
  }
}
