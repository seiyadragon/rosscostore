-- UP

create table Product (
    id integer,
    sku integer
);

create table ProductInfo (
    id integer,
    sku integer,
    name text,
    description text,
    category integer
);

create table Category (
    id integer,
    name text,
    parentCategory integer
);

-- Down
drop table Product;
drop table ProductInfo;
drop table Category;