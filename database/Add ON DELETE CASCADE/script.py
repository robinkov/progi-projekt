f = open("foreign_keys_my_tables.csv", "r")
g = open("add_delete_cascade.sql", "w")

line = f.readline().strip()

while line:
    seperated_line = line.split(",")
    constraint = seperated_line[0]
    table = seperated_line[1]
    column = seperated_line[2]
    parent_table = seperated_line[3]
    query = f"""
ALTER TABLE {table}
DROP CONSTRAINT {constraint};
ALTER TABLE {table}
ADD CONSTRAINT {constraint}
FOREIGN KEY ({column})
REFERENCES {parent_table}(id)
ON DELETE CASCADE;
"""
    g.write(query)
    line = f.readline().strip()

f.close()
g.close()
