const Projects = {
  key: "workshop_projects",

  all() {
    return Storage.get(this.key, []);
  },

  save(projects) {
    Storage.set(this.key, projects);
  },

  add(name, owner) {
    const projects = this.all();

    const project = {
      id: crypto.randomUUID(),
      name: name.trim(),
      owner: owner.trim(),
      createdAt: new Date().toLocaleDateString("tr-TR")
    };

    projects.unshift(project);
    this.save(projects);
    return project;
  },

  remove(id) {
    const projects = this.all().filter(project => project.id !== id);
    this.save(projects);
  }
};
