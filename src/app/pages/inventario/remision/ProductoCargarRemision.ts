export class ProductoCargarRemision{
    public Id_Producto:number = 0;
    public Cantidad_Disponible:number = 0;
    public Cantidad_Presentacion:number = 0;
    public Cantidad_Pendiente:number = 0;
    public Cantidad_Requerida:number = null;
    public Cantidad:number = null;
    public Costo:number = 0;
    public Rotativo:string = '0/0';
    public Categoria:string = '';
    public Id_Categoria:number = 0;
    public Id_Subcategoria:number = 0;
    public Codigo_Cum:string = '';
    public Embalaje:string = '';
    public Laboratorio_Comercial:string = '';
    public Laboratorio_Generico:string = '';
    public Nombre:string = '';
    public Nombre_Comercial:string = '';
    public Precio:string = '';
    public Precio_Regulado:number = 0;
    public Impuesto:number = 0;
    public Descuento:number = 0;
    public Subtotal:number = 0;
    public Total_Descuento:number = 0;
    public Total_Impuesto:number = 0;
    public Seleccionado:string = "0";
    public Regulado:string = "Si";
    public Lotes:Array<any> = [];
    public Lotes_Visuales:Array<string> = [];
    public Lotes_Seleccionados:Array<any> = [];
    public Similares:Array<any> = [];
}
