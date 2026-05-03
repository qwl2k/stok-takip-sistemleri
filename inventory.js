const Inventory = {
  key: "workshop_inventory",

  all() {
    return Storage.get(this.key, []);
  },

  save(items) {
    Storage.set(this.key, items);
  },

  generateCode() {
    return "STK-" + Math.floor(10000000 + Math.random() * 90000000);
  },

  add(name, category, quantity, min) {
    const items = this.all();

    const item = {
      id: crypto.randomUUID(),
      code: this.generateCode(),
      name: name.trim(),
      category: category.trim(),
      quantity: Number(quantity),
      min: Number(min),
      createdAt: new Date().toISOString()
    };

    items.unshift(item);
    this.save(items);
    return item;
  },

  remove(id) {
    const items = this.all().filter(item => item.id !== id);
    this.save(items);
  },

  stats() {
    const items = this.all();
    return {
      total: items.length,
      low: items.filter(i => i.quantity <= i.min).length,
      recent: items.slice(0, 5)
    };
  },

  exportCsv() {
    const items = this.all();
    const rows = [
      ["Kod", "Ad", "Kategori", "Adet", "Kritik Stok"],
      ...items.map(i => [i.code, i.name, i.category, i.quantity, i.min])
    ];

    const csv = rows.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "atolye-stok.csv";
    a.click();

    URL.revokeObjectURL(url);
  }
};
