import Text "mo:core/Text";
import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module Product {
    public func compareByName(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.name, p2.name);
    };
  };

  module Order_ {
    public func compareByCreatedAt(o1 : Order, o2 : Order) : Order.Order {
      Int.compare(o1.createdAt, o2.createdAt);
    };
  };

  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    imageUrl : Text;
    category : Text;
    stockQuantity : Nat;
    isAvailable : Bool;
  };

  public type OrderItem = {
    productId : Text;
    quantity : Nat;
    price : Nat;
  };

  public type PaymentMethod = {
    #cashOnDelivery;
  };

  public type OrderStatus = {
    #pending;
    #confirmed;
    #shipped;
    #delivered;
    #cancelled;
  };

  public type Order = {
    id : Text;
    customerName : Text;
    phoneNumber : Text;
    address : Text;
    items : [OrderItem];
    paymentMethod : PaymentMethod;
    status : OrderStatus;
    totalAmount : Nat;
    codFee : Nat;
    createdAt : Int;
  };

  public type Stats = {
    totalOrders : Nat;
    totalRevenue : Nat;
    pendingOrders : Nat;
    totalProducts : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  let products = Map.empty<Text, Product>();
  let orders = Map.empty<Text, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product management functions
  public shared ({ caller }) func createProduct(product : Product) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can create products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can delete products");
    };
    products.remove(productId);
  };

  public query ({ caller }) func listProducts() : async [Product] {
    let productValues = products.values();
    let productArray = productValues.toArray();
    productArray.sort(Product.compareByName);
  };

  public query ({ caller }) func getProduct(productId : Text) : async ?Product {
    products.get(productId);
  };

  public query ({ caller }) func searchProductsByCategory(category : Text) : async [Product] {
    let filtered = products.values().toArray().filter(
      func(p) {
        Text.equal(p.category, category);
      }
    );
    filtered.sort(Product.compareByName);
  };

  public query ({ caller }) func searchProductsByName(term : Text) : async [Product] {
    let filtered = products.values().toArray().filter(
      func(p) {
        p.name.contains(#text term) or p.description.contains(#text term);
      }
    );
    filtered.sort(Product.compareByName);
  };

  // Order management functions
  public shared ({ caller }) func placeOrder(
    customerName : Text,
    phoneNumber : Text,
    address : Text,
    items : [OrderItem],
    paymentMethod : PaymentMethod,
  ) : async Text {
    if (customerName.isEmpty() or phoneNumber.isEmpty() or address.isEmpty()) {
      Runtime.trap("Customer name, phone number and address are required");
    };

    if (items.size() == 0) {
      Runtime.trap("Order must have at least one item");
    };

    var totalAmount = 0;
    for (item in items.values()) {
      switch (products.get(item.productId)) {
        case (null) { Runtime.trap("Product " # item.productId # " does not exist") };
        case (?product) {
          if (item.quantity == 0) {
            Runtime.trap("Cannot order zero quantity of " # item.productId);
          } else if (item.quantity > product.stockQuantity) {
            Runtime.trap(product.name # " has only " # product.stockQuantity.toText() # " left");
          };
          totalAmount += item.price * item.quantity;
        };
      };
    };

    let codFee = 40;
    totalAmount += codFee;

    let orderId = (orders.size() + 1).toText();

    let newOrder : Order = {
      id = orderId;
      customerName;
      phoneNumber;
      address;
      items;
      paymentMethod;
      status = #pending;
      totalAmount;
      codFee;
      createdAt = Time.now();
    };

    orders.add(orderId, newOrder);

    for (item in items.values()) {
      switch (products.get(item.productId)) {
        case (?product) {
          let updatedProduct : Product = {
            id = product.id;
            name = product.name;
            description = product.description;
            price = product.price;
            imageUrl = product.imageUrl;
            category = product.category;
            stockQuantity = product.stockQuantity - item.quantity;
            isAvailable = product.isAvailable;
          };
          products.add(item.productId, updatedProduct);
        };
        case (null) {};
      };
    };

    orderId;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : OrderStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) {
        Runtime.trap("Order does not exist");
      };
      case (?order) {
        let updatedOrder : Order = {
          id = order.id;
          customerName = order.customerName;
          phoneNumber = order.phoneNumber;
          address = order.address;
          items = order.items;
          paymentMethod = order.paymentMethod;
          status;
          totalAmount = order.totalAmount;
          codFee = order.codFee;
          createdAt = order.createdAt;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func listOrders() : async [Order] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view all orders");
    };
    let orderValues = orders.values();
    let orderArray = orderValues.toArray();
    orderArray.sort(Order_.compareByCreatedAt);
  };

  // Dashboard statistics
  public query ({ caller }) func getStats() : async Stats {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view statistics");
    };

    var totalRevenue = 0;
    var pendingOrders = 0;

    for (order in orders.values()) {
      switch (order.status) {
        case (#pending) { pendingOrders += 1 };
        case (#confirmed) { totalRevenue += order.totalAmount };
        case (#shipped) { totalRevenue += order.totalAmount };
        case (#delivered) { totalRevenue += order.totalAmount };
        case (_) {};
      };
    };

    let stats : Stats = {
      totalOrders = orders.size();
      totalRevenue;
      pendingOrders;
      totalProducts = products.size();
    };

    stats;
  };
};
