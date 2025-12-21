
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model ApiKey
 * 
 */
export type ApiKey = $Result.DefaultSelection<Prisma.$ApiKeyPayload>
/**
 * Model AppliedJob
 * 
 */
export type AppliedJob = $Result.DefaultSelection<Prisma.$AppliedJobPayload>
/**
 * Model Progress
 * 
 */
export type Progress = $Result.DefaultSelection<Prisma.$ProgressPayload>
/**
 * Model AdminMentor
 * 
 */
export type AdminMentor = $Result.DefaultSelection<Prisma.$AdminMentorPayload>
/**
 * Model MentorSessionNote
 * 
 */
export type MentorSessionNote = $Result.DefaultSelection<Prisma.$MentorSessionNotePayload>
/**
 * Model UserStatus
 * 
 */
export type UserStatus = $Result.DefaultSelection<Prisma.$UserStatusPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.apiKey`: Exposes CRUD operations for the **ApiKey** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ApiKeys
    * const apiKeys = await prisma.apiKey.findMany()
    * ```
    */
  get apiKey(): Prisma.ApiKeyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.appliedJob`: Exposes CRUD operations for the **AppliedJob** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AppliedJobs
    * const appliedJobs = await prisma.appliedJob.findMany()
    * ```
    */
  get appliedJob(): Prisma.AppliedJobDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.progress`: Exposes CRUD operations for the **Progress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Progresses
    * const progresses = await prisma.progress.findMany()
    * ```
    */
  get progress(): Prisma.ProgressDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.adminMentor`: Exposes CRUD operations for the **AdminMentor** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AdminMentors
    * const adminMentors = await prisma.adminMentor.findMany()
    * ```
    */
  get adminMentor(): Prisma.AdminMentorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.mentorSessionNote`: Exposes CRUD operations for the **MentorSessionNote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MentorSessionNotes
    * const mentorSessionNotes = await prisma.mentorSessionNote.findMany()
    * ```
    */
  get mentorSessionNote(): Prisma.MentorSessionNoteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userStatus`: Exposes CRUD operations for the **UserStatus** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserStatuses
    * const userStatuses = await prisma.userStatus.findMany()
    * ```
    */
  get userStatus(): Prisma.UserStatusDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.17.0
   * Query Engine version: c0aafc03b8ef6cdced8654b9a817999e02457d6a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    ApiKey: 'ApiKey',
    AppliedJob: 'AppliedJob',
    Progress: 'Progress',
    AdminMentor: 'AdminMentor',
    MentorSessionNote: 'MentorSessionNote',
    UserStatus: 'UserStatus'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "apiKey" | "appliedJob" | "progress" | "adminMentor" | "mentorSessionNote" | "userStatus"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      ApiKey: {
        payload: Prisma.$ApiKeyPayload<ExtArgs>
        fields: Prisma.ApiKeyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ApiKeyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ApiKeyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          findFirst: {
            args: Prisma.ApiKeyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ApiKeyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          findMany: {
            args: Prisma.ApiKeyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>[]
          }
          create: {
            args: Prisma.ApiKeyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          createMany: {
            args: Prisma.ApiKeyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ApiKeyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>[]
          }
          delete: {
            args: Prisma.ApiKeyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          update: {
            args: Prisma.ApiKeyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          deleteMany: {
            args: Prisma.ApiKeyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ApiKeyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ApiKeyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>[]
          }
          upsert: {
            args: Prisma.ApiKeyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          aggregate: {
            args: Prisma.ApiKeyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApiKey>
          }
          groupBy: {
            args: Prisma.ApiKeyGroupByArgs<ExtArgs>
            result: $Utils.Optional<ApiKeyGroupByOutputType>[]
          }
          count: {
            args: Prisma.ApiKeyCountArgs<ExtArgs>
            result: $Utils.Optional<ApiKeyCountAggregateOutputType> | number
          }
        }
      }
      AppliedJob: {
        payload: Prisma.$AppliedJobPayload<ExtArgs>
        fields: Prisma.AppliedJobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AppliedJobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppliedJobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AppliedJobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppliedJobPayload>
          }
          findFirst: {
            args: Prisma.AppliedJobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppliedJobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AppliedJobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppliedJobPayload>
          }
          findMany: {
            args: Prisma.AppliedJobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppliedJobPayload>[]
          }
          create: {
            args: Prisma.AppliedJobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppliedJobPayload>
          }
          createMany: {
            args: Prisma.AppliedJobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AppliedJobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppliedJobPayload>[]
          }
          delete: {
            args: Prisma.AppliedJobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppliedJobPayload>
          }
          update: {
            args: Prisma.AppliedJobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppliedJobPayload>
          }
          deleteMany: {
            args: Prisma.AppliedJobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AppliedJobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AppliedJobUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppliedJobPayload>[]
          }
          upsert: {
            args: Prisma.AppliedJobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppliedJobPayload>
          }
          aggregate: {
            args: Prisma.AppliedJobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAppliedJob>
          }
          groupBy: {
            args: Prisma.AppliedJobGroupByArgs<ExtArgs>
            result: $Utils.Optional<AppliedJobGroupByOutputType>[]
          }
          count: {
            args: Prisma.AppliedJobCountArgs<ExtArgs>
            result: $Utils.Optional<AppliedJobCountAggregateOutputType> | number
          }
        }
      }
      Progress: {
        payload: Prisma.$ProgressPayload<ExtArgs>
        fields: Prisma.ProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>
          }
          findFirst: {
            args: Prisma.ProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>
          }
          findMany: {
            args: Prisma.ProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>[]
          }
          create: {
            args: Prisma.ProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>
          }
          createMany: {
            args: Prisma.ProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>[]
          }
          delete: {
            args: Prisma.ProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>
          }
          update: {
            args: Prisma.ProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>
          }
          deleteMany: {
            args: Prisma.ProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProgressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>[]
          }
          upsert: {
            args: Prisma.ProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>
          }
          aggregate: {
            args: Prisma.ProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProgress>
          }
          groupBy: {
            args: Prisma.ProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProgressCountArgs<ExtArgs>
            result: $Utils.Optional<ProgressCountAggregateOutputType> | number
          }
        }
      }
      AdminMentor: {
        payload: Prisma.$AdminMentorPayload<ExtArgs>
        fields: Prisma.AdminMentorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdminMentorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminMentorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminMentorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminMentorPayload>
          }
          findFirst: {
            args: Prisma.AdminMentorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminMentorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminMentorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminMentorPayload>
          }
          findMany: {
            args: Prisma.AdminMentorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminMentorPayload>[]
          }
          create: {
            args: Prisma.AdminMentorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminMentorPayload>
          }
          createMany: {
            args: Prisma.AdminMentorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AdminMentorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminMentorPayload>[]
          }
          delete: {
            args: Prisma.AdminMentorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminMentorPayload>
          }
          update: {
            args: Prisma.AdminMentorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminMentorPayload>
          }
          deleteMany: {
            args: Prisma.AdminMentorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdminMentorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AdminMentorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminMentorPayload>[]
          }
          upsert: {
            args: Prisma.AdminMentorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminMentorPayload>
          }
          aggregate: {
            args: Prisma.AdminMentorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdminMentor>
          }
          groupBy: {
            args: Prisma.AdminMentorGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminMentorGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminMentorCountArgs<ExtArgs>
            result: $Utils.Optional<AdminMentorCountAggregateOutputType> | number
          }
        }
      }
      MentorSessionNote: {
        payload: Prisma.$MentorSessionNotePayload<ExtArgs>
        fields: Prisma.MentorSessionNoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MentorSessionNoteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MentorSessionNotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MentorSessionNoteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MentorSessionNotePayload>
          }
          findFirst: {
            args: Prisma.MentorSessionNoteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MentorSessionNotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MentorSessionNoteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MentorSessionNotePayload>
          }
          findMany: {
            args: Prisma.MentorSessionNoteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MentorSessionNotePayload>[]
          }
          create: {
            args: Prisma.MentorSessionNoteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MentorSessionNotePayload>
          }
          createMany: {
            args: Prisma.MentorSessionNoteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MentorSessionNoteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MentorSessionNotePayload>[]
          }
          delete: {
            args: Prisma.MentorSessionNoteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MentorSessionNotePayload>
          }
          update: {
            args: Prisma.MentorSessionNoteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MentorSessionNotePayload>
          }
          deleteMany: {
            args: Prisma.MentorSessionNoteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MentorSessionNoteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MentorSessionNoteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MentorSessionNotePayload>[]
          }
          upsert: {
            args: Prisma.MentorSessionNoteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MentorSessionNotePayload>
          }
          aggregate: {
            args: Prisma.MentorSessionNoteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMentorSessionNote>
          }
          groupBy: {
            args: Prisma.MentorSessionNoteGroupByArgs<ExtArgs>
            result: $Utils.Optional<MentorSessionNoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.MentorSessionNoteCountArgs<ExtArgs>
            result: $Utils.Optional<MentorSessionNoteCountAggregateOutputType> | number
          }
        }
      }
      UserStatus: {
        payload: Prisma.$UserStatusPayload<ExtArgs>
        fields: Prisma.UserStatusFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserStatusFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStatusPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserStatusFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStatusPayload>
          }
          findFirst: {
            args: Prisma.UserStatusFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStatusPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserStatusFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStatusPayload>
          }
          findMany: {
            args: Prisma.UserStatusFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStatusPayload>[]
          }
          create: {
            args: Prisma.UserStatusCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStatusPayload>
          }
          createMany: {
            args: Prisma.UserStatusCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserStatusCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStatusPayload>[]
          }
          delete: {
            args: Prisma.UserStatusDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStatusPayload>
          }
          update: {
            args: Prisma.UserStatusUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStatusPayload>
          }
          deleteMany: {
            args: Prisma.UserStatusDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserStatusUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserStatusUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStatusPayload>[]
          }
          upsert: {
            args: Prisma.UserStatusUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStatusPayload>
          }
          aggregate: {
            args: Prisma.UserStatusAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserStatus>
          }
          groupBy: {
            args: Prisma.UserStatusGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserStatusGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserStatusCountArgs<ExtArgs>
            result: $Utils.Optional<UserStatusCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    apiKey?: ApiKeyOmit
    appliedJob?: AppliedJobOmit
    progress?: ProgressOmit
    adminMentor?: AdminMentorOmit
    mentorSessionNote?: MentorSessionNoteOmit
    userStatus?: UserStatusOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    apiKeys: number
    appliedJobs: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    apiKeys?: boolean | UserCountOutputTypeCountApiKeysArgs
    appliedJobs?: boolean | UserCountOutputTypeCountAppliedJobsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountApiKeysArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApiKeyWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAppliedJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppliedJobWhereInput
  }


  /**
   * Count Type AdminMentorCountOutputType
   */

  export type AdminMentorCountOutputType = {
    User: number
  }

  export type AdminMentorCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | AdminMentorCountOutputTypeCountUserArgs
  }

  // Custom InputTypes
  /**
   * AdminMentorCountOutputType without action
   */
  export type AdminMentorCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminMentorCountOutputType
     */
    select?: AdminMentorCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AdminMentorCountOutputType without action
   */
  export type AdminMentorCountOutputTypeCountUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    goalPerDay: number | null
  }

  export type UserSumAggregateOutputType = {
    goalPerDay: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    firebaseUid: string | null
    email: string | null
    fullName: string | null
    createdAt: Date | null
    updatedAt: Date | null
    goalPerDay: number | null
    mentorId: string | null
    deletedAt: Date | null
    verifiedByAdmin: boolean | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    firebaseUid: string | null
    email: string | null
    fullName: string | null
    createdAt: Date | null
    updatedAt: Date | null
    goalPerDay: number | null
    mentorId: string | null
    deletedAt: Date | null
    verifiedByAdmin: boolean | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    firebaseUid: number
    email: number
    fullName: number
    createdAt: number
    updatedAt: number
    goalPerDay: number
    mentorId: number
    deletedAt: number
    verifiedByAdmin: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    goalPerDay?: true
  }

  export type UserSumAggregateInputType = {
    goalPerDay?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    firebaseUid?: true
    email?: true
    fullName?: true
    createdAt?: true
    updatedAt?: true
    goalPerDay?: true
    mentorId?: true
    deletedAt?: true
    verifiedByAdmin?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    firebaseUid?: true
    email?: true
    fullName?: true
    createdAt?: true
    updatedAt?: true
    goalPerDay?: true
    mentorId?: true
    deletedAt?: true
    verifiedByAdmin?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    firebaseUid?: true
    email?: true
    fullName?: true
    createdAt?: true
    updatedAt?: true
    goalPerDay?: true
    mentorId?: true
    deletedAt?: true
    verifiedByAdmin?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    firebaseUid: string
    email: string
    fullName: string | null
    createdAt: Date
    updatedAt: Date
    goalPerDay: number
    mentorId: string | null
    deletedAt: Date | null
    verifiedByAdmin: boolean
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firebaseUid?: boolean
    email?: boolean
    fullName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    goalPerDay?: boolean
    mentorId?: boolean
    deletedAt?: boolean
    verifiedByAdmin?: boolean
    apiKeys?: boolean | User$apiKeysArgs<ExtArgs>
    appliedJobs?: boolean | User$appliedJobsArgs<ExtArgs>
    Progress?: boolean | User$ProgressArgs<ExtArgs>
    AdminMentor?: boolean | User$AdminMentorArgs<ExtArgs>
    UserStatus?: boolean | User$UserStatusArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firebaseUid?: boolean
    email?: boolean
    fullName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    goalPerDay?: boolean
    mentorId?: boolean
    deletedAt?: boolean
    verifiedByAdmin?: boolean
    AdminMentor?: boolean | User$AdminMentorArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firebaseUid?: boolean
    email?: boolean
    fullName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    goalPerDay?: boolean
    mentorId?: boolean
    deletedAt?: boolean
    verifiedByAdmin?: boolean
    AdminMentor?: boolean | User$AdminMentorArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    firebaseUid?: boolean
    email?: boolean
    fullName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    goalPerDay?: boolean
    mentorId?: boolean
    deletedAt?: boolean
    verifiedByAdmin?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "firebaseUid" | "email" | "fullName" | "createdAt" | "updatedAt" | "goalPerDay" | "mentorId" | "deletedAt" | "verifiedByAdmin", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    apiKeys?: boolean | User$apiKeysArgs<ExtArgs>
    appliedJobs?: boolean | User$appliedJobsArgs<ExtArgs>
    Progress?: boolean | User$ProgressArgs<ExtArgs>
    AdminMentor?: boolean | User$AdminMentorArgs<ExtArgs>
    UserStatus?: boolean | User$UserStatusArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    AdminMentor?: boolean | User$AdminMentorArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    AdminMentor?: boolean | User$AdminMentorArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      apiKeys: Prisma.$ApiKeyPayload<ExtArgs>[]
      appliedJobs: Prisma.$AppliedJobPayload<ExtArgs>[]
      Progress: Prisma.$ProgressPayload<ExtArgs> | null
      AdminMentor: Prisma.$AdminMentorPayload<ExtArgs> | null
      UserStatus: Prisma.$UserStatusPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      firebaseUid: string
      email: string
      fullName: string | null
      createdAt: Date
      updatedAt: Date
      goalPerDay: number
      mentorId: string | null
      deletedAt: Date | null
      verifiedByAdmin: boolean
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    apiKeys<T extends User$apiKeysArgs<ExtArgs> = {}>(args?: Subset<T, User$apiKeysArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    appliedJobs<T extends User$appliedJobsArgs<ExtArgs> = {}>(args?: Subset<T, User$appliedJobsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppliedJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Progress<T extends User$ProgressArgs<ExtArgs> = {}>(args?: Subset<T, User$ProgressArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    AdminMentor<T extends User$AdminMentorArgs<ExtArgs> = {}>(args?: Subset<T, User$AdminMentorArgs<ExtArgs>>): Prisma__AdminMentorClient<$Result.GetResult<Prisma.$AdminMentorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    UserStatus<T extends User$UserStatusArgs<ExtArgs> = {}>(args?: Subset<T, User$UserStatusArgs<ExtArgs>>): Prisma__UserStatusClient<$Result.GetResult<Prisma.$UserStatusPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly firebaseUid: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly fullName: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly goalPerDay: FieldRef<"User", 'Int'>
    readonly mentorId: FieldRef<"User", 'String'>
    readonly deletedAt: FieldRef<"User", 'DateTime'>
    readonly verifiedByAdmin: FieldRef<"User", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.apiKeys
   */
  export type User$apiKeysArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    where?: ApiKeyWhereInput
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    cursor?: ApiKeyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * User.appliedJobs
   */
  export type User$appliedJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppliedJob
     */
    select?: AppliedJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppliedJob
     */
    omit?: AppliedJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppliedJobInclude<ExtArgs> | null
    where?: AppliedJobWhereInput
    orderBy?: AppliedJobOrderByWithRelationInput | AppliedJobOrderByWithRelationInput[]
    cursor?: AppliedJobWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppliedJobScalarFieldEnum | AppliedJobScalarFieldEnum[]
  }

  /**
   * User.Progress
   */
  export type User$ProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    where?: ProgressWhereInput
  }

  /**
   * User.AdminMentor
   */
  export type User$AdminMentorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminMentor
     */
    select?: AdminMentorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminMentor
     */
    omit?: AdminMentorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminMentorInclude<ExtArgs> | null
    where?: AdminMentorWhereInput
  }

  /**
   * User.UserStatus
   */
  export type User$UserStatusArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStatus
     */
    select?: UserStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStatus
     */
    omit?: UserStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatusInclude<ExtArgs> | null
    where?: UserStatusWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model ApiKey
   */

  export type AggregateApiKey = {
    _count: ApiKeyCountAggregateOutputType | null
    _min: ApiKeyMinAggregateOutputType | null
    _max: ApiKeyMaxAggregateOutputType | null
  }

  export type ApiKeyMinAggregateOutputType = {
    id: string | null
    key: string | null
    name: string | null
    userId: string | null
    createdAt: Date | null
    lastUsedAt: Date | null
    isActive: boolean | null
    deletedAt: Date | null
  }

  export type ApiKeyMaxAggregateOutputType = {
    id: string | null
    key: string | null
    name: string | null
    userId: string | null
    createdAt: Date | null
    lastUsedAt: Date | null
    isActive: boolean | null
    deletedAt: Date | null
  }

  export type ApiKeyCountAggregateOutputType = {
    id: number
    key: number
    name: number
    userId: number
    createdAt: number
    lastUsedAt: number
    isActive: number
    deletedAt: number
    _all: number
  }


  export type ApiKeyMinAggregateInputType = {
    id?: true
    key?: true
    name?: true
    userId?: true
    createdAt?: true
    lastUsedAt?: true
    isActive?: true
    deletedAt?: true
  }

  export type ApiKeyMaxAggregateInputType = {
    id?: true
    key?: true
    name?: true
    userId?: true
    createdAt?: true
    lastUsedAt?: true
    isActive?: true
    deletedAt?: true
  }

  export type ApiKeyCountAggregateInputType = {
    id?: true
    key?: true
    name?: true
    userId?: true
    createdAt?: true
    lastUsedAt?: true
    isActive?: true
    deletedAt?: true
    _all?: true
  }

  export type ApiKeyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApiKey to aggregate.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ApiKeys
    **/
    _count?: true | ApiKeyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ApiKeyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ApiKeyMaxAggregateInputType
  }

  export type GetApiKeyAggregateType<T extends ApiKeyAggregateArgs> = {
        [P in keyof T & keyof AggregateApiKey]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApiKey[P]>
      : GetScalarType<T[P], AggregateApiKey[P]>
  }




  export type ApiKeyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApiKeyWhereInput
    orderBy?: ApiKeyOrderByWithAggregationInput | ApiKeyOrderByWithAggregationInput[]
    by: ApiKeyScalarFieldEnum[] | ApiKeyScalarFieldEnum
    having?: ApiKeyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ApiKeyCountAggregateInputType | true
    _min?: ApiKeyMinAggregateInputType
    _max?: ApiKeyMaxAggregateInputType
  }

  export type ApiKeyGroupByOutputType = {
    id: string
    key: string
    name: string
    userId: string
    createdAt: Date
    lastUsedAt: Date | null
    isActive: boolean
    deletedAt: Date | null
    _count: ApiKeyCountAggregateOutputType | null
    _min: ApiKeyMinAggregateOutputType | null
    _max: ApiKeyMaxAggregateOutputType | null
  }

  type GetApiKeyGroupByPayload<T extends ApiKeyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ApiKeyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ApiKeyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ApiKeyGroupByOutputType[P]>
            : GetScalarType<T[P], ApiKeyGroupByOutputType[P]>
        }
      >
    >


  export type ApiKeySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    name?: boolean
    userId?: boolean
    createdAt?: boolean
    lastUsedAt?: boolean
    isActive?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["apiKey"]>

  export type ApiKeySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    name?: boolean
    userId?: boolean
    createdAt?: boolean
    lastUsedAt?: boolean
    isActive?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["apiKey"]>

  export type ApiKeySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    name?: boolean
    userId?: boolean
    createdAt?: boolean
    lastUsedAt?: boolean
    isActive?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["apiKey"]>

  export type ApiKeySelectScalar = {
    id?: boolean
    key?: boolean
    name?: boolean
    userId?: boolean
    createdAt?: boolean
    lastUsedAt?: boolean
    isActive?: boolean
    deletedAt?: boolean
  }

  export type ApiKeyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "key" | "name" | "userId" | "createdAt" | "lastUsedAt" | "isActive" | "deletedAt", ExtArgs["result"]["apiKey"]>
  export type ApiKeyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ApiKeyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ApiKeyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ApiKeyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ApiKey"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      key: string
      name: string
      userId: string
      createdAt: Date
      lastUsedAt: Date | null
      isActive: boolean
      deletedAt: Date | null
    }, ExtArgs["result"]["apiKey"]>
    composites: {}
  }

  type ApiKeyGetPayload<S extends boolean | null | undefined | ApiKeyDefaultArgs> = $Result.GetResult<Prisma.$ApiKeyPayload, S>

  type ApiKeyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ApiKeyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ApiKeyCountAggregateInputType | true
    }

  export interface ApiKeyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ApiKey'], meta: { name: 'ApiKey' } }
    /**
     * Find zero or one ApiKey that matches the filter.
     * @param {ApiKeyFindUniqueArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ApiKeyFindUniqueArgs>(args: SelectSubset<T, ApiKeyFindUniqueArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ApiKey that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ApiKeyFindUniqueOrThrowArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ApiKeyFindUniqueOrThrowArgs>(args: SelectSubset<T, ApiKeyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApiKey that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyFindFirstArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ApiKeyFindFirstArgs>(args?: SelectSubset<T, ApiKeyFindFirstArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApiKey that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyFindFirstOrThrowArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ApiKeyFindFirstOrThrowArgs>(args?: SelectSubset<T, ApiKeyFindFirstOrThrowArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ApiKeys that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ApiKeys
     * const apiKeys = await prisma.apiKey.findMany()
     * 
     * // Get first 10 ApiKeys
     * const apiKeys = await prisma.apiKey.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const apiKeyWithIdOnly = await prisma.apiKey.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ApiKeyFindManyArgs>(args?: SelectSubset<T, ApiKeyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ApiKey.
     * @param {ApiKeyCreateArgs} args - Arguments to create a ApiKey.
     * @example
     * // Create one ApiKey
     * const ApiKey = await prisma.apiKey.create({
     *   data: {
     *     // ... data to create a ApiKey
     *   }
     * })
     * 
     */
    create<T extends ApiKeyCreateArgs>(args: SelectSubset<T, ApiKeyCreateArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ApiKeys.
     * @param {ApiKeyCreateManyArgs} args - Arguments to create many ApiKeys.
     * @example
     * // Create many ApiKeys
     * const apiKey = await prisma.apiKey.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ApiKeyCreateManyArgs>(args?: SelectSubset<T, ApiKeyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ApiKeys and returns the data saved in the database.
     * @param {ApiKeyCreateManyAndReturnArgs} args - Arguments to create many ApiKeys.
     * @example
     * // Create many ApiKeys
     * const apiKey = await prisma.apiKey.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ApiKeys and only return the `id`
     * const apiKeyWithIdOnly = await prisma.apiKey.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ApiKeyCreateManyAndReturnArgs>(args?: SelectSubset<T, ApiKeyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ApiKey.
     * @param {ApiKeyDeleteArgs} args - Arguments to delete one ApiKey.
     * @example
     * // Delete one ApiKey
     * const ApiKey = await prisma.apiKey.delete({
     *   where: {
     *     // ... filter to delete one ApiKey
     *   }
     * })
     * 
     */
    delete<T extends ApiKeyDeleteArgs>(args: SelectSubset<T, ApiKeyDeleteArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ApiKey.
     * @param {ApiKeyUpdateArgs} args - Arguments to update one ApiKey.
     * @example
     * // Update one ApiKey
     * const apiKey = await prisma.apiKey.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ApiKeyUpdateArgs>(args: SelectSubset<T, ApiKeyUpdateArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ApiKeys.
     * @param {ApiKeyDeleteManyArgs} args - Arguments to filter ApiKeys to delete.
     * @example
     * // Delete a few ApiKeys
     * const { count } = await prisma.apiKey.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ApiKeyDeleteManyArgs>(args?: SelectSubset<T, ApiKeyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApiKeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ApiKeys
     * const apiKey = await prisma.apiKey.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ApiKeyUpdateManyArgs>(args: SelectSubset<T, ApiKeyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApiKeys and returns the data updated in the database.
     * @param {ApiKeyUpdateManyAndReturnArgs} args - Arguments to update many ApiKeys.
     * @example
     * // Update many ApiKeys
     * const apiKey = await prisma.apiKey.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ApiKeys and only return the `id`
     * const apiKeyWithIdOnly = await prisma.apiKey.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ApiKeyUpdateManyAndReturnArgs>(args: SelectSubset<T, ApiKeyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ApiKey.
     * @param {ApiKeyUpsertArgs} args - Arguments to update or create a ApiKey.
     * @example
     * // Update or create a ApiKey
     * const apiKey = await prisma.apiKey.upsert({
     *   create: {
     *     // ... data to create a ApiKey
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ApiKey we want to update
     *   }
     * })
     */
    upsert<T extends ApiKeyUpsertArgs>(args: SelectSubset<T, ApiKeyUpsertArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ApiKeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyCountArgs} args - Arguments to filter ApiKeys to count.
     * @example
     * // Count the number of ApiKeys
     * const count = await prisma.apiKey.count({
     *   where: {
     *     // ... the filter for the ApiKeys we want to count
     *   }
     * })
    **/
    count<T extends ApiKeyCountArgs>(
      args?: Subset<T, ApiKeyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ApiKeyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ApiKey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ApiKeyAggregateArgs>(args: Subset<T, ApiKeyAggregateArgs>): Prisma.PrismaPromise<GetApiKeyAggregateType<T>>

    /**
     * Group by ApiKey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ApiKeyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ApiKeyGroupByArgs['orderBy'] }
        : { orderBy?: ApiKeyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ApiKeyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApiKeyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ApiKey model
   */
  readonly fields: ApiKeyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ApiKey.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ApiKeyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ApiKey model
   */
  interface ApiKeyFieldRefs {
    readonly id: FieldRef<"ApiKey", 'String'>
    readonly key: FieldRef<"ApiKey", 'String'>
    readonly name: FieldRef<"ApiKey", 'String'>
    readonly userId: FieldRef<"ApiKey", 'String'>
    readonly createdAt: FieldRef<"ApiKey", 'DateTime'>
    readonly lastUsedAt: FieldRef<"ApiKey", 'DateTime'>
    readonly isActive: FieldRef<"ApiKey", 'Boolean'>
    readonly deletedAt: FieldRef<"ApiKey", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ApiKey findUnique
   */
  export type ApiKeyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey findUniqueOrThrow
   */
  export type ApiKeyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey findFirst
   */
  export type ApiKeyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApiKeys.
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiKeys.
     */
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * ApiKey findFirstOrThrow
   */
  export type ApiKeyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApiKeys.
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiKeys.
     */
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * ApiKey findMany
   */
  export type ApiKeyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKeys to fetch.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ApiKeys.
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * ApiKey create
   */
  export type ApiKeyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * The data needed to create a ApiKey.
     */
    data: XOR<ApiKeyCreateInput, ApiKeyUncheckedCreateInput>
  }

  /**
   * ApiKey createMany
   */
  export type ApiKeyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ApiKeys.
     */
    data: ApiKeyCreateManyInput | ApiKeyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ApiKey createManyAndReturn
   */
  export type ApiKeyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * The data used to create many ApiKeys.
     */
    data: ApiKeyCreateManyInput | ApiKeyCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ApiKey update
   */
  export type ApiKeyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * The data needed to update a ApiKey.
     */
    data: XOR<ApiKeyUpdateInput, ApiKeyUncheckedUpdateInput>
    /**
     * Choose, which ApiKey to update.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey updateMany
   */
  export type ApiKeyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ApiKeys.
     */
    data: XOR<ApiKeyUpdateManyMutationInput, ApiKeyUncheckedUpdateManyInput>
    /**
     * Filter which ApiKeys to update
     */
    where?: ApiKeyWhereInput
    /**
     * Limit how many ApiKeys to update.
     */
    limit?: number
  }

  /**
   * ApiKey updateManyAndReturn
   */
  export type ApiKeyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * The data used to update ApiKeys.
     */
    data: XOR<ApiKeyUpdateManyMutationInput, ApiKeyUncheckedUpdateManyInput>
    /**
     * Filter which ApiKeys to update
     */
    where?: ApiKeyWhereInput
    /**
     * Limit how many ApiKeys to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ApiKey upsert
   */
  export type ApiKeyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * The filter to search for the ApiKey to update in case it exists.
     */
    where: ApiKeyWhereUniqueInput
    /**
     * In case the ApiKey found by the `where` argument doesn't exist, create a new ApiKey with this data.
     */
    create: XOR<ApiKeyCreateInput, ApiKeyUncheckedCreateInput>
    /**
     * In case the ApiKey was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ApiKeyUpdateInput, ApiKeyUncheckedUpdateInput>
  }

  /**
   * ApiKey delete
   */
  export type ApiKeyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter which ApiKey to delete.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey deleteMany
   */
  export type ApiKeyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApiKeys to delete
     */
    where?: ApiKeyWhereInput
    /**
     * Limit how many ApiKeys to delete.
     */
    limit?: number
  }

  /**
   * ApiKey without action
   */
  export type ApiKeyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
  }


  /**
   * Model AppliedJob
   */

  export type AggregateAppliedJob = {
    _count: AppliedJobCountAggregateOutputType | null
    _min: AppliedJobMinAggregateOutputType | null
    _max: AppliedJobMaxAggregateOutputType | null
  }

  export type AppliedJobMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    company: string | null
    location: string | null
    url: string | null
    appliedDate: Date | null
    appliedText: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
    type: string | null
    deletedAt: Date | null
  }

  export type AppliedJobMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    company: string | null
    location: string | null
    url: string | null
    appliedDate: Date | null
    appliedText: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
    type: string | null
    deletedAt: Date | null
  }

  export type AppliedJobCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    company: number
    location: number
    url: number
    appliedDate: number
    appliedText: number
    status: number
    createdAt: number
    updatedAt: number
    type: number
    deletedAt: number
    _all: number
  }


  export type AppliedJobMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    company?: true
    location?: true
    url?: true
    appliedDate?: true
    appliedText?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    type?: true
    deletedAt?: true
  }

  export type AppliedJobMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    company?: true
    location?: true
    url?: true
    appliedDate?: true
    appliedText?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    type?: true
    deletedAt?: true
  }

  export type AppliedJobCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    company?: true
    location?: true
    url?: true
    appliedDate?: true
    appliedText?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    type?: true
    deletedAt?: true
    _all?: true
  }

  export type AppliedJobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AppliedJob to aggregate.
     */
    where?: AppliedJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppliedJobs to fetch.
     */
    orderBy?: AppliedJobOrderByWithRelationInput | AppliedJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AppliedJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppliedJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppliedJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AppliedJobs
    **/
    _count?: true | AppliedJobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AppliedJobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AppliedJobMaxAggregateInputType
  }

  export type GetAppliedJobAggregateType<T extends AppliedJobAggregateArgs> = {
        [P in keyof T & keyof AggregateAppliedJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAppliedJob[P]>
      : GetScalarType<T[P], AggregateAppliedJob[P]>
  }




  export type AppliedJobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppliedJobWhereInput
    orderBy?: AppliedJobOrderByWithAggregationInput | AppliedJobOrderByWithAggregationInput[]
    by: AppliedJobScalarFieldEnum[] | AppliedJobScalarFieldEnum
    having?: AppliedJobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AppliedJobCountAggregateInputType | true
    _min?: AppliedJobMinAggregateInputType
    _max?: AppliedJobMaxAggregateInputType
  }

  export type AppliedJobGroupByOutputType = {
    id: string
    userId: string
    title: string
    company: string | null
    location: string | null
    url: string
    appliedDate: Date
    appliedText: string | null
    status: string
    createdAt: Date
    updatedAt: Date
    type: string
    deletedAt: Date | null
    _count: AppliedJobCountAggregateOutputType | null
    _min: AppliedJobMinAggregateOutputType | null
    _max: AppliedJobMaxAggregateOutputType | null
  }

  type GetAppliedJobGroupByPayload<T extends AppliedJobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AppliedJobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AppliedJobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AppliedJobGroupByOutputType[P]>
            : GetScalarType<T[P], AppliedJobGroupByOutputType[P]>
        }
      >
    >


  export type AppliedJobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    company?: boolean
    location?: boolean
    url?: boolean
    appliedDate?: boolean
    appliedText?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    type?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appliedJob"]>

  export type AppliedJobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    company?: boolean
    location?: boolean
    url?: boolean
    appliedDate?: boolean
    appliedText?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    type?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appliedJob"]>

  export type AppliedJobSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    company?: boolean
    location?: boolean
    url?: boolean
    appliedDate?: boolean
    appliedText?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    type?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appliedJob"]>

  export type AppliedJobSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    company?: boolean
    location?: boolean
    url?: boolean
    appliedDate?: boolean
    appliedText?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    type?: boolean
    deletedAt?: boolean
  }

  export type AppliedJobOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "title" | "company" | "location" | "url" | "appliedDate" | "appliedText" | "status" | "createdAt" | "updatedAt" | "type" | "deletedAt", ExtArgs["result"]["appliedJob"]>
  export type AppliedJobInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AppliedJobIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AppliedJobIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AppliedJobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AppliedJob"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      title: string
      company: string | null
      location: string | null
      url: string
      appliedDate: Date
      appliedText: string | null
      status: string
      createdAt: Date
      updatedAt: Date
      type: string
      deletedAt: Date | null
    }, ExtArgs["result"]["appliedJob"]>
    composites: {}
  }

  type AppliedJobGetPayload<S extends boolean | null | undefined | AppliedJobDefaultArgs> = $Result.GetResult<Prisma.$AppliedJobPayload, S>

  type AppliedJobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AppliedJobFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AppliedJobCountAggregateInputType | true
    }

  export interface AppliedJobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AppliedJob'], meta: { name: 'AppliedJob' } }
    /**
     * Find zero or one AppliedJob that matches the filter.
     * @param {AppliedJobFindUniqueArgs} args - Arguments to find a AppliedJob
     * @example
     * // Get one AppliedJob
     * const appliedJob = await prisma.appliedJob.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AppliedJobFindUniqueArgs>(args: SelectSubset<T, AppliedJobFindUniqueArgs<ExtArgs>>): Prisma__AppliedJobClient<$Result.GetResult<Prisma.$AppliedJobPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AppliedJob that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AppliedJobFindUniqueOrThrowArgs} args - Arguments to find a AppliedJob
     * @example
     * // Get one AppliedJob
     * const appliedJob = await prisma.appliedJob.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AppliedJobFindUniqueOrThrowArgs>(args: SelectSubset<T, AppliedJobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AppliedJobClient<$Result.GetResult<Prisma.$AppliedJobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AppliedJob that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppliedJobFindFirstArgs} args - Arguments to find a AppliedJob
     * @example
     * // Get one AppliedJob
     * const appliedJob = await prisma.appliedJob.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AppliedJobFindFirstArgs>(args?: SelectSubset<T, AppliedJobFindFirstArgs<ExtArgs>>): Prisma__AppliedJobClient<$Result.GetResult<Prisma.$AppliedJobPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AppliedJob that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppliedJobFindFirstOrThrowArgs} args - Arguments to find a AppliedJob
     * @example
     * // Get one AppliedJob
     * const appliedJob = await prisma.appliedJob.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AppliedJobFindFirstOrThrowArgs>(args?: SelectSubset<T, AppliedJobFindFirstOrThrowArgs<ExtArgs>>): Prisma__AppliedJobClient<$Result.GetResult<Prisma.$AppliedJobPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AppliedJobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppliedJobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AppliedJobs
     * const appliedJobs = await prisma.appliedJob.findMany()
     * 
     * // Get first 10 AppliedJobs
     * const appliedJobs = await prisma.appliedJob.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const appliedJobWithIdOnly = await prisma.appliedJob.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AppliedJobFindManyArgs>(args?: SelectSubset<T, AppliedJobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppliedJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AppliedJob.
     * @param {AppliedJobCreateArgs} args - Arguments to create a AppliedJob.
     * @example
     * // Create one AppliedJob
     * const AppliedJob = await prisma.appliedJob.create({
     *   data: {
     *     // ... data to create a AppliedJob
     *   }
     * })
     * 
     */
    create<T extends AppliedJobCreateArgs>(args: SelectSubset<T, AppliedJobCreateArgs<ExtArgs>>): Prisma__AppliedJobClient<$Result.GetResult<Prisma.$AppliedJobPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AppliedJobs.
     * @param {AppliedJobCreateManyArgs} args - Arguments to create many AppliedJobs.
     * @example
     * // Create many AppliedJobs
     * const appliedJob = await prisma.appliedJob.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AppliedJobCreateManyArgs>(args?: SelectSubset<T, AppliedJobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AppliedJobs and returns the data saved in the database.
     * @param {AppliedJobCreateManyAndReturnArgs} args - Arguments to create many AppliedJobs.
     * @example
     * // Create many AppliedJobs
     * const appliedJob = await prisma.appliedJob.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AppliedJobs and only return the `id`
     * const appliedJobWithIdOnly = await prisma.appliedJob.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AppliedJobCreateManyAndReturnArgs>(args?: SelectSubset<T, AppliedJobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppliedJobPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AppliedJob.
     * @param {AppliedJobDeleteArgs} args - Arguments to delete one AppliedJob.
     * @example
     * // Delete one AppliedJob
     * const AppliedJob = await prisma.appliedJob.delete({
     *   where: {
     *     // ... filter to delete one AppliedJob
     *   }
     * })
     * 
     */
    delete<T extends AppliedJobDeleteArgs>(args: SelectSubset<T, AppliedJobDeleteArgs<ExtArgs>>): Prisma__AppliedJobClient<$Result.GetResult<Prisma.$AppliedJobPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AppliedJob.
     * @param {AppliedJobUpdateArgs} args - Arguments to update one AppliedJob.
     * @example
     * // Update one AppliedJob
     * const appliedJob = await prisma.appliedJob.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AppliedJobUpdateArgs>(args: SelectSubset<T, AppliedJobUpdateArgs<ExtArgs>>): Prisma__AppliedJobClient<$Result.GetResult<Prisma.$AppliedJobPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AppliedJobs.
     * @param {AppliedJobDeleteManyArgs} args - Arguments to filter AppliedJobs to delete.
     * @example
     * // Delete a few AppliedJobs
     * const { count } = await prisma.appliedJob.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AppliedJobDeleteManyArgs>(args?: SelectSubset<T, AppliedJobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AppliedJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppliedJobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AppliedJobs
     * const appliedJob = await prisma.appliedJob.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AppliedJobUpdateManyArgs>(args: SelectSubset<T, AppliedJobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AppliedJobs and returns the data updated in the database.
     * @param {AppliedJobUpdateManyAndReturnArgs} args - Arguments to update many AppliedJobs.
     * @example
     * // Update many AppliedJobs
     * const appliedJob = await prisma.appliedJob.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AppliedJobs and only return the `id`
     * const appliedJobWithIdOnly = await prisma.appliedJob.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AppliedJobUpdateManyAndReturnArgs>(args: SelectSubset<T, AppliedJobUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppliedJobPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AppliedJob.
     * @param {AppliedJobUpsertArgs} args - Arguments to update or create a AppliedJob.
     * @example
     * // Update or create a AppliedJob
     * const appliedJob = await prisma.appliedJob.upsert({
     *   create: {
     *     // ... data to create a AppliedJob
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AppliedJob we want to update
     *   }
     * })
     */
    upsert<T extends AppliedJobUpsertArgs>(args: SelectSubset<T, AppliedJobUpsertArgs<ExtArgs>>): Prisma__AppliedJobClient<$Result.GetResult<Prisma.$AppliedJobPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AppliedJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppliedJobCountArgs} args - Arguments to filter AppliedJobs to count.
     * @example
     * // Count the number of AppliedJobs
     * const count = await prisma.appliedJob.count({
     *   where: {
     *     // ... the filter for the AppliedJobs we want to count
     *   }
     * })
    **/
    count<T extends AppliedJobCountArgs>(
      args?: Subset<T, AppliedJobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AppliedJobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AppliedJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppliedJobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AppliedJobAggregateArgs>(args: Subset<T, AppliedJobAggregateArgs>): Prisma.PrismaPromise<GetAppliedJobAggregateType<T>>

    /**
     * Group by AppliedJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppliedJobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AppliedJobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AppliedJobGroupByArgs['orderBy'] }
        : { orderBy?: AppliedJobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AppliedJobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAppliedJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AppliedJob model
   */
  readonly fields: AppliedJobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AppliedJob.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AppliedJobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AppliedJob model
   */
  interface AppliedJobFieldRefs {
    readonly id: FieldRef<"AppliedJob", 'String'>
    readonly userId: FieldRef<"AppliedJob", 'String'>
    readonly title: FieldRef<"AppliedJob", 'String'>
    readonly company: FieldRef<"AppliedJob", 'String'>
    readonly location: FieldRef<"AppliedJob", 'String'>
    readonly url: FieldRef<"AppliedJob", 'String'>
    readonly appliedDate: FieldRef<"AppliedJob", 'DateTime'>
    readonly appliedText: FieldRef<"AppliedJob", 'String'>
    readonly status: FieldRef<"AppliedJob", 'String'>
    readonly createdAt: FieldRef<"AppliedJob", 'DateTime'>
    readonly updatedAt: FieldRef<"AppliedJob", 'DateTime'>
    readonly type: FieldRef<"AppliedJob", 'String'>
    readonly deletedAt: FieldRef<"AppliedJob", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AppliedJob findUnique
   */
  export type AppliedJobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppliedJob
     */
    select?: AppliedJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppliedJob
     */
    omit?: AppliedJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppliedJobInclude<ExtArgs> | null
    /**
     * Filter, which AppliedJob to fetch.
     */
    where: AppliedJobWhereUniqueInput
  }

  /**
   * AppliedJob findUniqueOrThrow
   */
  export type AppliedJobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppliedJob
     */
    select?: AppliedJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppliedJob
     */
    omit?: AppliedJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppliedJobInclude<ExtArgs> | null
    /**
     * Filter, which AppliedJob to fetch.
     */
    where: AppliedJobWhereUniqueInput
  }

  /**
   * AppliedJob findFirst
   */
  export type AppliedJobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppliedJob
     */
    select?: AppliedJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppliedJob
     */
    omit?: AppliedJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppliedJobInclude<ExtArgs> | null
    /**
     * Filter, which AppliedJob to fetch.
     */
    where?: AppliedJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppliedJobs to fetch.
     */
    orderBy?: AppliedJobOrderByWithRelationInput | AppliedJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AppliedJobs.
     */
    cursor?: AppliedJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppliedJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppliedJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AppliedJobs.
     */
    distinct?: AppliedJobScalarFieldEnum | AppliedJobScalarFieldEnum[]
  }

  /**
   * AppliedJob findFirstOrThrow
   */
  export type AppliedJobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppliedJob
     */
    select?: AppliedJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppliedJob
     */
    omit?: AppliedJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppliedJobInclude<ExtArgs> | null
    /**
     * Filter, which AppliedJob to fetch.
     */
    where?: AppliedJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppliedJobs to fetch.
     */
    orderBy?: AppliedJobOrderByWithRelationInput | AppliedJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AppliedJobs.
     */
    cursor?: AppliedJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppliedJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppliedJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AppliedJobs.
     */
    distinct?: AppliedJobScalarFieldEnum | AppliedJobScalarFieldEnum[]
  }

  /**
   * AppliedJob findMany
   */
  export type AppliedJobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppliedJob
     */
    select?: AppliedJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppliedJob
     */
    omit?: AppliedJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppliedJobInclude<ExtArgs> | null
    /**
     * Filter, which AppliedJobs to fetch.
     */
    where?: AppliedJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppliedJobs to fetch.
     */
    orderBy?: AppliedJobOrderByWithRelationInput | AppliedJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AppliedJobs.
     */
    cursor?: AppliedJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppliedJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppliedJobs.
     */
    skip?: number
    distinct?: AppliedJobScalarFieldEnum | AppliedJobScalarFieldEnum[]
  }

  /**
   * AppliedJob create
   */
  export type AppliedJobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppliedJob
     */
    select?: AppliedJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppliedJob
     */
    omit?: AppliedJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppliedJobInclude<ExtArgs> | null
    /**
     * The data needed to create a AppliedJob.
     */
    data: XOR<AppliedJobCreateInput, AppliedJobUncheckedCreateInput>
  }

  /**
   * AppliedJob createMany
   */
  export type AppliedJobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AppliedJobs.
     */
    data: AppliedJobCreateManyInput | AppliedJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AppliedJob createManyAndReturn
   */
  export type AppliedJobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppliedJob
     */
    select?: AppliedJobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AppliedJob
     */
    omit?: AppliedJobOmit<ExtArgs> | null
    /**
     * The data used to create many AppliedJobs.
     */
    data: AppliedJobCreateManyInput | AppliedJobCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppliedJobIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AppliedJob update
   */
  export type AppliedJobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppliedJob
     */
    select?: AppliedJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppliedJob
     */
    omit?: AppliedJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppliedJobInclude<ExtArgs> | null
    /**
     * The data needed to update a AppliedJob.
     */
    data: XOR<AppliedJobUpdateInput, AppliedJobUncheckedUpdateInput>
    /**
     * Choose, which AppliedJob to update.
     */
    where: AppliedJobWhereUniqueInput
  }

  /**
   * AppliedJob updateMany
   */
  export type AppliedJobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AppliedJobs.
     */
    data: XOR<AppliedJobUpdateManyMutationInput, AppliedJobUncheckedUpdateManyInput>
    /**
     * Filter which AppliedJobs to update
     */
    where?: AppliedJobWhereInput
    /**
     * Limit how many AppliedJobs to update.
     */
    limit?: number
  }

  /**
   * AppliedJob updateManyAndReturn
   */
  export type AppliedJobUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppliedJob
     */
    select?: AppliedJobSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AppliedJob
     */
    omit?: AppliedJobOmit<ExtArgs> | null
    /**
     * The data used to update AppliedJobs.
     */
    data: XOR<AppliedJobUpdateManyMutationInput, AppliedJobUncheckedUpdateManyInput>
    /**
     * Filter which AppliedJobs to update
     */
    where?: AppliedJobWhereInput
    /**
     * Limit how many AppliedJobs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppliedJobIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AppliedJob upsert
   */
  export type AppliedJobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppliedJob
     */
    select?: AppliedJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppliedJob
     */
    omit?: AppliedJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppliedJobInclude<ExtArgs> | null
    /**
     * The filter to search for the AppliedJob to update in case it exists.
     */
    where: AppliedJobWhereUniqueInput
    /**
     * In case the AppliedJob found by the `where` argument doesn't exist, create a new AppliedJob with this data.
     */
    create: XOR<AppliedJobCreateInput, AppliedJobUncheckedCreateInput>
    /**
     * In case the AppliedJob was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AppliedJobUpdateInput, AppliedJobUncheckedUpdateInput>
  }

  /**
   * AppliedJob delete
   */
  export type AppliedJobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppliedJob
     */
    select?: AppliedJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppliedJob
     */
    omit?: AppliedJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppliedJobInclude<ExtArgs> | null
    /**
     * Filter which AppliedJob to delete.
     */
    where: AppliedJobWhereUniqueInput
  }

  /**
   * AppliedJob deleteMany
   */
  export type AppliedJobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AppliedJobs to delete
     */
    where?: AppliedJobWhereInput
    /**
     * Limit how many AppliedJobs to delete.
     */
    limit?: number
  }

  /**
   * AppliedJob without action
   */
  export type AppliedJobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppliedJob
     */
    select?: AppliedJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppliedJob
     */
    omit?: AppliedJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppliedJobInclude<ExtArgs> | null
  }


  /**
   * Model Progress
   */

  export type AggregateProgress = {
    _count: ProgressCountAggregateOutputType | null
    _min: ProgressMinAggregateOutputType | null
    _max: ProgressMaxAggregateOutputType | null
  }

  export type ProgressMinAggregateOutputType = {
    id: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type ProgressMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type ProgressCountAggregateOutputType = {
    id: number
    userId: number
    weeks: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type ProgressMinAggregateInputType = {
    id?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type ProgressMaxAggregateInputType = {
    id?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type ProgressCountAggregateInputType = {
    id?: true
    userId?: true
    weeks?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type ProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Progress to aggregate.
     */
    where?: ProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Progresses to fetch.
     */
    orderBy?: ProgressOrderByWithRelationInput | ProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Progresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Progresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Progresses
    **/
    _count?: true | ProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProgressMaxAggregateInputType
  }

  export type GetProgressAggregateType<T extends ProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProgress[P]>
      : GetScalarType<T[P], AggregateProgress[P]>
  }




  export type ProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgressWhereInput
    orderBy?: ProgressOrderByWithAggregationInput | ProgressOrderByWithAggregationInput[]
    by: ProgressScalarFieldEnum[] | ProgressScalarFieldEnum
    having?: ProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProgressCountAggregateInputType | true
    _min?: ProgressMinAggregateInputType
    _max?: ProgressMaxAggregateInputType
  }

  export type ProgressGroupByOutputType = {
    id: string
    userId: string
    weeks: JsonValue
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: ProgressCountAggregateOutputType | null
    _min: ProgressMinAggregateOutputType | null
    _max: ProgressMaxAggregateOutputType | null
  }

  type GetProgressGroupByPayload<T extends ProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProgressGroupByOutputType[P]>
            : GetScalarType<T[P], ProgressGroupByOutputType[P]>
        }
      >
    >


  export type ProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    weeks?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["progress"]>

  export type ProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    weeks?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["progress"]>

  export type ProgressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    weeks?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["progress"]>

  export type ProgressSelectScalar = {
    id?: boolean
    userId?: boolean
    weeks?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type ProgressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "weeks" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["progress"]>
  export type ProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProgressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Progress"
    objects: {
      User: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      weeks: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["progress"]>
    composites: {}
  }

  type ProgressGetPayload<S extends boolean | null | undefined | ProgressDefaultArgs> = $Result.GetResult<Prisma.$ProgressPayload, S>

  type ProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProgressCountAggregateInputType | true
    }

  export interface ProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Progress'], meta: { name: 'Progress' } }
    /**
     * Find zero or one Progress that matches the filter.
     * @param {ProgressFindUniqueArgs} args - Arguments to find a Progress
     * @example
     * // Get one Progress
     * const progress = await prisma.progress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProgressFindUniqueArgs>(args: SelectSubset<T, ProgressFindUniqueArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Progress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProgressFindUniqueOrThrowArgs} args - Arguments to find a Progress
     * @example
     * // Get one Progress
     * const progress = await prisma.progress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, ProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Progress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressFindFirstArgs} args - Arguments to find a Progress
     * @example
     * // Get one Progress
     * const progress = await prisma.progress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProgressFindFirstArgs>(args?: SelectSubset<T, ProgressFindFirstArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Progress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressFindFirstOrThrowArgs} args - Arguments to find a Progress
     * @example
     * // Get one Progress
     * const progress = await prisma.progress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, ProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Progresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Progresses
     * const progresses = await prisma.progress.findMany()
     * 
     * // Get first 10 Progresses
     * const progresses = await prisma.progress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const progressWithIdOnly = await prisma.progress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProgressFindManyArgs>(args?: SelectSubset<T, ProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Progress.
     * @param {ProgressCreateArgs} args - Arguments to create a Progress.
     * @example
     * // Create one Progress
     * const Progress = await prisma.progress.create({
     *   data: {
     *     // ... data to create a Progress
     *   }
     * })
     * 
     */
    create<T extends ProgressCreateArgs>(args: SelectSubset<T, ProgressCreateArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Progresses.
     * @param {ProgressCreateManyArgs} args - Arguments to create many Progresses.
     * @example
     * // Create many Progresses
     * const progress = await prisma.progress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProgressCreateManyArgs>(args?: SelectSubset<T, ProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Progresses and returns the data saved in the database.
     * @param {ProgressCreateManyAndReturnArgs} args - Arguments to create many Progresses.
     * @example
     * // Create many Progresses
     * const progress = await prisma.progress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Progresses and only return the `id`
     * const progressWithIdOnly = await prisma.progress.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, ProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Progress.
     * @param {ProgressDeleteArgs} args - Arguments to delete one Progress.
     * @example
     * // Delete one Progress
     * const Progress = await prisma.progress.delete({
     *   where: {
     *     // ... filter to delete one Progress
     *   }
     * })
     * 
     */
    delete<T extends ProgressDeleteArgs>(args: SelectSubset<T, ProgressDeleteArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Progress.
     * @param {ProgressUpdateArgs} args - Arguments to update one Progress.
     * @example
     * // Update one Progress
     * const progress = await prisma.progress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProgressUpdateArgs>(args: SelectSubset<T, ProgressUpdateArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Progresses.
     * @param {ProgressDeleteManyArgs} args - Arguments to filter Progresses to delete.
     * @example
     * // Delete a few Progresses
     * const { count } = await prisma.progress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProgressDeleteManyArgs>(args?: SelectSubset<T, ProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Progresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Progresses
     * const progress = await prisma.progress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProgressUpdateManyArgs>(args: SelectSubset<T, ProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Progresses and returns the data updated in the database.
     * @param {ProgressUpdateManyAndReturnArgs} args - Arguments to update many Progresses.
     * @example
     * // Update many Progresses
     * const progress = await prisma.progress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Progresses and only return the `id`
     * const progressWithIdOnly = await prisma.progress.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProgressUpdateManyAndReturnArgs>(args: SelectSubset<T, ProgressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Progress.
     * @param {ProgressUpsertArgs} args - Arguments to update or create a Progress.
     * @example
     * // Update or create a Progress
     * const progress = await prisma.progress.upsert({
     *   create: {
     *     // ... data to create a Progress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Progress we want to update
     *   }
     * })
     */
    upsert<T extends ProgressUpsertArgs>(args: SelectSubset<T, ProgressUpsertArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Progresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressCountArgs} args - Arguments to filter Progresses to count.
     * @example
     * // Count the number of Progresses
     * const count = await prisma.progress.count({
     *   where: {
     *     // ... the filter for the Progresses we want to count
     *   }
     * })
    **/
    count<T extends ProgressCountArgs>(
      args?: Subset<T, ProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Progress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProgressAggregateArgs>(args: Subset<T, ProgressAggregateArgs>): Prisma.PrismaPromise<GetProgressAggregateType<T>>

    /**
     * Group by Progress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProgressGroupByArgs['orderBy'] }
        : { orderBy?: ProgressGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Progress model
   */
  readonly fields: ProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Progress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    User<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Progress model
   */
  interface ProgressFieldRefs {
    readonly id: FieldRef<"Progress", 'String'>
    readonly userId: FieldRef<"Progress", 'String'>
    readonly weeks: FieldRef<"Progress", 'Json'>
    readonly createdAt: FieldRef<"Progress", 'DateTime'>
    readonly updatedAt: FieldRef<"Progress", 'DateTime'>
    readonly deletedAt: FieldRef<"Progress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Progress findUnique
   */
  export type ProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * Filter, which Progress to fetch.
     */
    where: ProgressWhereUniqueInput
  }

  /**
   * Progress findUniqueOrThrow
   */
  export type ProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * Filter, which Progress to fetch.
     */
    where: ProgressWhereUniqueInput
  }

  /**
   * Progress findFirst
   */
  export type ProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * Filter, which Progress to fetch.
     */
    where?: ProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Progresses to fetch.
     */
    orderBy?: ProgressOrderByWithRelationInput | ProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Progresses.
     */
    cursor?: ProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Progresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Progresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Progresses.
     */
    distinct?: ProgressScalarFieldEnum | ProgressScalarFieldEnum[]
  }

  /**
   * Progress findFirstOrThrow
   */
  export type ProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * Filter, which Progress to fetch.
     */
    where?: ProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Progresses to fetch.
     */
    orderBy?: ProgressOrderByWithRelationInput | ProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Progresses.
     */
    cursor?: ProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Progresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Progresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Progresses.
     */
    distinct?: ProgressScalarFieldEnum | ProgressScalarFieldEnum[]
  }

  /**
   * Progress findMany
   */
  export type ProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * Filter, which Progresses to fetch.
     */
    where?: ProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Progresses to fetch.
     */
    orderBy?: ProgressOrderByWithRelationInput | ProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Progresses.
     */
    cursor?: ProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Progresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Progresses.
     */
    skip?: number
    distinct?: ProgressScalarFieldEnum | ProgressScalarFieldEnum[]
  }

  /**
   * Progress create
   */
  export type ProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a Progress.
     */
    data: XOR<ProgressCreateInput, ProgressUncheckedCreateInput>
  }

  /**
   * Progress createMany
   */
  export type ProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Progresses.
     */
    data: ProgressCreateManyInput | ProgressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Progress createManyAndReturn
   */
  export type ProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * The data used to create many Progresses.
     */
    data: ProgressCreateManyInput | ProgressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Progress update
   */
  export type ProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a Progress.
     */
    data: XOR<ProgressUpdateInput, ProgressUncheckedUpdateInput>
    /**
     * Choose, which Progress to update.
     */
    where: ProgressWhereUniqueInput
  }

  /**
   * Progress updateMany
   */
  export type ProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Progresses.
     */
    data: XOR<ProgressUpdateManyMutationInput, ProgressUncheckedUpdateManyInput>
    /**
     * Filter which Progresses to update
     */
    where?: ProgressWhereInput
    /**
     * Limit how many Progresses to update.
     */
    limit?: number
  }

  /**
   * Progress updateManyAndReturn
   */
  export type ProgressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * The data used to update Progresses.
     */
    data: XOR<ProgressUpdateManyMutationInput, ProgressUncheckedUpdateManyInput>
    /**
     * Filter which Progresses to update
     */
    where?: ProgressWhereInput
    /**
     * Limit how many Progresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Progress upsert
   */
  export type ProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the Progress to update in case it exists.
     */
    where: ProgressWhereUniqueInput
    /**
     * In case the Progress found by the `where` argument doesn't exist, create a new Progress with this data.
     */
    create: XOR<ProgressCreateInput, ProgressUncheckedCreateInput>
    /**
     * In case the Progress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProgressUpdateInput, ProgressUncheckedUpdateInput>
  }

  /**
   * Progress delete
   */
  export type ProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * Filter which Progress to delete.
     */
    where: ProgressWhereUniqueInput
  }

  /**
   * Progress deleteMany
   */
  export type ProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Progresses to delete
     */
    where?: ProgressWhereInput
    /**
     * Limit how many Progresses to delete.
     */
    limit?: number
  }

  /**
   * Progress without action
   */
  export type ProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
  }


  /**
   * Model AdminMentor
   */

  export type AggregateAdminMentor = {
    _count: AdminMentorCountAggregateOutputType | null
    _min: AdminMentorMinAggregateOutputType | null
    _max: AdminMentorMaxAggregateOutputType | null
  }

  export type AdminMentorMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    name: string | null
    picture: string | null
    expertise: string | null
    background: string | null
    availability: string | null
    isAdmin: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
    company: string | null
    role: string | null
    verifiedByAdmin: boolean | null
  }

  export type AdminMentorMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    name: string | null
    picture: string | null
    expertise: string | null
    background: string | null
    availability: string | null
    isAdmin: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
    company: string | null
    role: string | null
    verifiedByAdmin: boolean | null
  }

  export type AdminMentorCountAggregateOutputType = {
    id: number
    email: number
    password: number
    name: number
    picture: number
    expertise: number
    background: number
    availability: number
    isAdmin: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    company: number
    role: number
    verifiedByAdmin: number
    _all: number
  }


  export type AdminMentorMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    picture?: true
    expertise?: true
    background?: true
    availability?: true
    isAdmin?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    company?: true
    role?: true
    verifiedByAdmin?: true
  }

  export type AdminMentorMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    picture?: true
    expertise?: true
    background?: true
    availability?: true
    isAdmin?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    company?: true
    role?: true
    verifiedByAdmin?: true
  }

  export type AdminMentorCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    picture?: true
    expertise?: true
    background?: true
    availability?: true
    isAdmin?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    company?: true
    role?: true
    verifiedByAdmin?: true
    _all?: true
  }

  export type AdminMentorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminMentor to aggregate.
     */
    where?: AdminMentorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminMentors to fetch.
     */
    orderBy?: AdminMentorOrderByWithRelationInput | AdminMentorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminMentorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminMentors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminMentors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AdminMentors
    **/
    _count?: true | AdminMentorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminMentorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminMentorMaxAggregateInputType
  }

  export type GetAdminMentorAggregateType<T extends AdminMentorAggregateArgs> = {
        [P in keyof T & keyof AggregateAdminMentor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdminMentor[P]>
      : GetScalarType<T[P], AggregateAdminMentor[P]>
  }




  export type AdminMentorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminMentorWhereInput
    orderBy?: AdminMentorOrderByWithAggregationInput | AdminMentorOrderByWithAggregationInput[]
    by: AdminMentorScalarFieldEnum[] | AdminMentorScalarFieldEnum
    having?: AdminMentorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminMentorCountAggregateInputType | true
    _min?: AdminMentorMinAggregateInputType
    _max?: AdminMentorMaxAggregateInputType
  }

  export type AdminMentorGroupByOutputType = {
    id: string
    email: string
    password: string
    name: string
    picture: string | null
    expertise: string | null
    background: string | null
    availability: string | null
    isAdmin: boolean
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    company: string | null
    role: string | null
    verifiedByAdmin: boolean
    _count: AdminMentorCountAggregateOutputType | null
    _min: AdminMentorMinAggregateOutputType | null
    _max: AdminMentorMaxAggregateOutputType | null
  }

  type GetAdminMentorGroupByPayload<T extends AdminMentorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminMentorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminMentorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminMentorGroupByOutputType[P]>
            : GetScalarType<T[P], AdminMentorGroupByOutputType[P]>
        }
      >
    >


  export type AdminMentorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    picture?: boolean
    expertise?: boolean
    background?: boolean
    availability?: boolean
    isAdmin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    company?: boolean
    role?: boolean
    verifiedByAdmin?: boolean
    User?: boolean | AdminMentor$UserArgs<ExtArgs>
    _count?: boolean | AdminMentorCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["adminMentor"]>

  export type AdminMentorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    picture?: boolean
    expertise?: boolean
    background?: boolean
    availability?: boolean
    isAdmin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    company?: boolean
    role?: boolean
    verifiedByAdmin?: boolean
  }, ExtArgs["result"]["adminMentor"]>

  export type AdminMentorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    picture?: boolean
    expertise?: boolean
    background?: boolean
    availability?: boolean
    isAdmin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    company?: boolean
    role?: boolean
    verifiedByAdmin?: boolean
  }, ExtArgs["result"]["adminMentor"]>

  export type AdminMentorSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    picture?: boolean
    expertise?: boolean
    background?: boolean
    availability?: boolean
    isAdmin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    company?: boolean
    role?: boolean
    verifiedByAdmin?: boolean
  }

  export type AdminMentorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "name" | "picture" | "expertise" | "background" | "availability" | "isAdmin" | "createdAt" | "updatedAt" | "deletedAt" | "company" | "role" | "verifiedByAdmin", ExtArgs["result"]["adminMentor"]>
  export type AdminMentorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | AdminMentor$UserArgs<ExtArgs>
    _count?: boolean | AdminMentorCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AdminMentorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AdminMentorIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AdminMentorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AdminMentor"
    objects: {
      User: Prisma.$UserPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      name: string
      picture: string | null
      expertise: string | null
      background: string | null
      availability: string | null
      isAdmin: boolean
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
      company: string | null
      role: string | null
      verifiedByAdmin: boolean
    }, ExtArgs["result"]["adminMentor"]>
    composites: {}
  }

  type AdminMentorGetPayload<S extends boolean | null | undefined | AdminMentorDefaultArgs> = $Result.GetResult<Prisma.$AdminMentorPayload, S>

  type AdminMentorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AdminMentorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AdminMentorCountAggregateInputType | true
    }

  export interface AdminMentorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AdminMentor'], meta: { name: 'AdminMentor' } }
    /**
     * Find zero or one AdminMentor that matches the filter.
     * @param {AdminMentorFindUniqueArgs} args - Arguments to find a AdminMentor
     * @example
     * // Get one AdminMentor
     * const adminMentor = await prisma.adminMentor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminMentorFindUniqueArgs>(args: SelectSubset<T, AdminMentorFindUniqueArgs<ExtArgs>>): Prisma__AdminMentorClient<$Result.GetResult<Prisma.$AdminMentorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AdminMentor that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AdminMentorFindUniqueOrThrowArgs} args - Arguments to find a AdminMentor
     * @example
     * // Get one AdminMentor
     * const adminMentor = await prisma.adminMentor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminMentorFindUniqueOrThrowArgs>(args: SelectSubset<T, AdminMentorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdminMentorClient<$Result.GetResult<Prisma.$AdminMentorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AdminMentor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminMentorFindFirstArgs} args - Arguments to find a AdminMentor
     * @example
     * // Get one AdminMentor
     * const adminMentor = await prisma.adminMentor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminMentorFindFirstArgs>(args?: SelectSubset<T, AdminMentorFindFirstArgs<ExtArgs>>): Prisma__AdminMentorClient<$Result.GetResult<Prisma.$AdminMentorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AdminMentor that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminMentorFindFirstOrThrowArgs} args - Arguments to find a AdminMentor
     * @example
     * // Get one AdminMentor
     * const adminMentor = await prisma.adminMentor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminMentorFindFirstOrThrowArgs>(args?: SelectSubset<T, AdminMentorFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdminMentorClient<$Result.GetResult<Prisma.$AdminMentorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AdminMentors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminMentorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AdminMentors
     * const adminMentors = await prisma.adminMentor.findMany()
     * 
     * // Get first 10 AdminMentors
     * const adminMentors = await prisma.adminMentor.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminMentorWithIdOnly = await prisma.adminMentor.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdminMentorFindManyArgs>(args?: SelectSubset<T, AdminMentorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminMentorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AdminMentor.
     * @param {AdminMentorCreateArgs} args - Arguments to create a AdminMentor.
     * @example
     * // Create one AdminMentor
     * const AdminMentor = await prisma.adminMentor.create({
     *   data: {
     *     // ... data to create a AdminMentor
     *   }
     * })
     * 
     */
    create<T extends AdminMentorCreateArgs>(args: SelectSubset<T, AdminMentorCreateArgs<ExtArgs>>): Prisma__AdminMentorClient<$Result.GetResult<Prisma.$AdminMentorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AdminMentors.
     * @param {AdminMentorCreateManyArgs} args - Arguments to create many AdminMentors.
     * @example
     * // Create many AdminMentors
     * const adminMentor = await prisma.adminMentor.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdminMentorCreateManyArgs>(args?: SelectSubset<T, AdminMentorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AdminMentors and returns the data saved in the database.
     * @param {AdminMentorCreateManyAndReturnArgs} args - Arguments to create many AdminMentors.
     * @example
     * // Create many AdminMentors
     * const adminMentor = await prisma.adminMentor.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AdminMentors and only return the `id`
     * const adminMentorWithIdOnly = await prisma.adminMentor.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AdminMentorCreateManyAndReturnArgs>(args?: SelectSubset<T, AdminMentorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminMentorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AdminMentor.
     * @param {AdminMentorDeleteArgs} args - Arguments to delete one AdminMentor.
     * @example
     * // Delete one AdminMentor
     * const AdminMentor = await prisma.adminMentor.delete({
     *   where: {
     *     // ... filter to delete one AdminMentor
     *   }
     * })
     * 
     */
    delete<T extends AdminMentorDeleteArgs>(args: SelectSubset<T, AdminMentorDeleteArgs<ExtArgs>>): Prisma__AdminMentorClient<$Result.GetResult<Prisma.$AdminMentorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AdminMentor.
     * @param {AdminMentorUpdateArgs} args - Arguments to update one AdminMentor.
     * @example
     * // Update one AdminMentor
     * const adminMentor = await prisma.adminMentor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdminMentorUpdateArgs>(args: SelectSubset<T, AdminMentorUpdateArgs<ExtArgs>>): Prisma__AdminMentorClient<$Result.GetResult<Prisma.$AdminMentorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AdminMentors.
     * @param {AdminMentorDeleteManyArgs} args - Arguments to filter AdminMentors to delete.
     * @example
     * // Delete a few AdminMentors
     * const { count } = await prisma.adminMentor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdminMentorDeleteManyArgs>(args?: SelectSubset<T, AdminMentorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdminMentors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminMentorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AdminMentors
     * const adminMentor = await prisma.adminMentor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdminMentorUpdateManyArgs>(args: SelectSubset<T, AdminMentorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdminMentors and returns the data updated in the database.
     * @param {AdminMentorUpdateManyAndReturnArgs} args - Arguments to update many AdminMentors.
     * @example
     * // Update many AdminMentors
     * const adminMentor = await prisma.adminMentor.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AdminMentors and only return the `id`
     * const adminMentorWithIdOnly = await prisma.adminMentor.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AdminMentorUpdateManyAndReturnArgs>(args: SelectSubset<T, AdminMentorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminMentorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AdminMentor.
     * @param {AdminMentorUpsertArgs} args - Arguments to update or create a AdminMentor.
     * @example
     * // Update or create a AdminMentor
     * const adminMentor = await prisma.adminMentor.upsert({
     *   create: {
     *     // ... data to create a AdminMentor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AdminMentor we want to update
     *   }
     * })
     */
    upsert<T extends AdminMentorUpsertArgs>(args: SelectSubset<T, AdminMentorUpsertArgs<ExtArgs>>): Prisma__AdminMentorClient<$Result.GetResult<Prisma.$AdminMentorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AdminMentors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminMentorCountArgs} args - Arguments to filter AdminMentors to count.
     * @example
     * // Count the number of AdminMentors
     * const count = await prisma.adminMentor.count({
     *   where: {
     *     // ... the filter for the AdminMentors we want to count
     *   }
     * })
    **/
    count<T extends AdminMentorCountArgs>(
      args?: Subset<T, AdminMentorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminMentorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AdminMentor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminMentorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdminMentorAggregateArgs>(args: Subset<T, AdminMentorAggregateArgs>): Prisma.PrismaPromise<GetAdminMentorAggregateType<T>>

    /**
     * Group by AdminMentor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminMentorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AdminMentorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminMentorGroupByArgs['orderBy'] }
        : { orderBy?: AdminMentorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AdminMentorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminMentorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AdminMentor model
   */
  readonly fields: AdminMentorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AdminMentor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminMentorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    User<T extends AdminMentor$UserArgs<ExtArgs> = {}>(args?: Subset<T, AdminMentor$UserArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AdminMentor model
   */
  interface AdminMentorFieldRefs {
    readonly id: FieldRef<"AdminMentor", 'String'>
    readonly email: FieldRef<"AdminMentor", 'String'>
    readonly password: FieldRef<"AdminMentor", 'String'>
    readonly name: FieldRef<"AdminMentor", 'String'>
    readonly picture: FieldRef<"AdminMentor", 'String'>
    readonly expertise: FieldRef<"AdminMentor", 'String'>
    readonly background: FieldRef<"AdminMentor", 'String'>
    readonly availability: FieldRef<"AdminMentor", 'String'>
    readonly isAdmin: FieldRef<"AdminMentor", 'Boolean'>
    readonly createdAt: FieldRef<"AdminMentor", 'DateTime'>
    readonly updatedAt: FieldRef<"AdminMentor", 'DateTime'>
    readonly deletedAt: FieldRef<"AdminMentor", 'DateTime'>
    readonly company: FieldRef<"AdminMentor", 'String'>
    readonly role: FieldRef<"AdminMentor", 'String'>
    readonly verifiedByAdmin: FieldRef<"AdminMentor", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * AdminMentor findUnique
   */
  export type AdminMentorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminMentor
     */
    select?: AdminMentorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminMentor
     */
    omit?: AdminMentorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminMentorInclude<ExtArgs> | null
    /**
     * Filter, which AdminMentor to fetch.
     */
    where: AdminMentorWhereUniqueInput
  }

  /**
   * AdminMentor findUniqueOrThrow
   */
  export type AdminMentorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminMentor
     */
    select?: AdminMentorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminMentor
     */
    omit?: AdminMentorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminMentorInclude<ExtArgs> | null
    /**
     * Filter, which AdminMentor to fetch.
     */
    where: AdminMentorWhereUniqueInput
  }

  /**
   * AdminMentor findFirst
   */
  export type AdminMentorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminMentor
     */
    select?: AdminMentorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminMentor
     */
    omit?: AdminMentorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminMentorInclude<ExtArgs> | null
    /**
     * Filter, which AdminMentor to fetch.
     */
    where?: AdminMentorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminMentors to fetch.
     */
    orderBy?: AdminMentorOrderByWithRelationInput | AdminMentorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminMentors.
     */
    cursor?: AdminMentorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminMentors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminMentors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminMentors.
     */
    distinct?: AdminMentorScalarFieldEnum | AdminMentorScalarFieldEnum[]
  }

  /**
   * AdminMentor findFirstOrThrow
   */
  export type AdminMentorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminMentor
     */
    select?: AdminMentorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminMentor
     */
    omit?: AdminMentorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminMentorInclude<ExtArgs> | null
    /**
     * Filter, which AdminMentor to fetch.
     */
    where?: AdminMentorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminMentors to fetch.
     */
    orderBy?: AdminMentorOrderByWithRelationInput | AdminMentorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminMentors.
     */
    cursor?: AdminMentorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminMentors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminMentors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminMentors.
     */
    distinct?: AdminMentorScalarFieldEnum | AdminMentorScalarFieldEnum[]
  }

  /**
   * AdminMentor findMany
   */
  export type AdminMentorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminMentor
     */
    select?: AdminMentorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminMentor
     */
    omit?: AdminMentorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminMentorInclude<ExtArgs> | null
    /**
     * Filter, which AdminMentors to fetch.
     */
    where?: AdminMentorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminMentors to fetch.
     */
    orderBy?: AdminMentorOrderByWithRelationInput | AdminMentorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AdminMentors.
     */
    cursor?: AdminMentorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminMentors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminMentors.
     */
    skip?: number
    distinct?: AdminMentorScalarFieldEnum | AdminMentorScalarFieldEnum[]
  }

  /**
   * AdminMentor create
   */
  export type AdminMentorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminMentor
     */
    select?: AdminMentorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminMentor
     */
    omit?: AdminMentorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminMentorInclude<ExtArgs> | null
    /**
     * The data needed to create a AdminMentor.
     */
    data: XOR<AdminMentorCreateInput, AdminMentorUncheckedCreateInput>
  }

  /**
   * AdminMentor createMany
   */
  export type AdminMentorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AdminMentors.
     */
    data: AdminMentorCreateManyInput | AdminMentorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AdminMentor createManyAndReturn
   */
  export type AdminMentorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminMentor
     */
    select?: AdminMentorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AdminMentor
     */
    omit?: AdminMentorOmit<ExtArgs> | null
    /**
     * The data used to create many AdminMentors.
     */
    data: AdminMentorCreateManyInput | AdminMentorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AdminMentor update
   */
  export type AdminMentorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminMentor
     */
    select?: AdminMentorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminMentor
     */
    omit?: AdminMentorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminMentorInclude<ExtArgs> | null
    /**
     * The data needed to update a AdminMentor.
     */
    data: XOR<AdminMentorUpdateInput, AdminMentorUncheckedUpdateInput>
    /**
     * Choose, which AdminMentor to update.
     */
    where: AdminMentorWhereUniqueInput
  }

  /**
   * AdminMentor updateMany
   */
  export type AdminMentorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AdminMentors.
     */
    data: XOR<AdminMentorUpdateManyMutationInput, AdminMentorUncheckedUpdateManyInput>
    /**
     * Filter which AdminMentors to update
     */
    where?: AdminMentorWhereInput
    /**
     * Limit how many AdminMentors to update.
     */
    limit?: number
  }

  /**
   * AdminMentor updateManyAndReturn
   */
  export type AdminMentorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminMentor
     */
    select?: AdminMentorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AdminMentor
     */
    omit?: AdminMentorOmit<ExtArgs> | null
    /**
     * The data used to update AdminMentors.
     */
    data: XOR<AdminMentorUpdateManyMutationInput, AdminMentorUncheckedUpdateManyInput>
    /**
     * Filter which AdminMentors to update
     */
    where?: AdminMentorWhereInput
    /**
     * Limit how many AdminMentors to update.
     */
    limit?: number
  }

  /**
   * AdminMentor upsert
   */
  export type AdminMentorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminMentor
     */
    select?: AdminMentorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminMentor
     */
    omit?: AdminMentorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminMentorInclude<ExtArgs> | null
    /**
     * The filter to search for the AdminMentor to update in case it exists.
     */
    where: AdminMentorWhereUniqueInput
    /**
     * In case the AdminMentor found by the `where` argument doesn't exist, create a new AdminMentor with this data.
     */
    create: XOR<AdminMentorCreateInput, AdminMentorUncheckedCreateInput>
    /**
     * In case the AdminMentor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminMentorUpdateInput, AdminMentorUncheckedUpdateInput>
  }

  /**
   * AdminMentor delete
   */
  export type AdminMentorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminMentor
     */
    select?: AdminMentorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminMentor
     */
    omit?: AdminMentorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminMentorInclude<ExtArgs> | null
    /**
     * Filter which AdminMentor to delete.
     */
    where: AdminMentorWhereUniqueInput
  }

  /**
   * AdminMentor deleteMany
   */
  export type AdminMentorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminMentors to delete
     */
    where?: AdminMentorWhereInput
    /**
     * Limit how many AdminMentors to delete.
     */
    limit?: number
  }

  /**
   * AdminMentor.User
   */
  export type AdminMentor$UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * AdminMentor without action
   */
  export type AdminMentorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminMentor
     */
    select?: AdminMentorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminMentor
     */
    omit?: AdminMentorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminMentorInclude<ExtArgs> | null
  }


  /**
   * Model MentorSessionNote
   */

  export type AggregateMentorSessionNote = {
    _count: MentorSessionNoteCountAggregateOutputType | null
    _avg: MentorSessionNoteAvgAggregateOutputType | null
    _sum: MentorSessionNoteSumAggregateOutputType | null
    _min: MentorSessionNoteMinAggregateOutputType | null
    _max: MentorSessionNoteMaxAggregateOutputType | null
  }

  export type MentorSessionNoteAvgAggregateOutputType = {
    callNumber: number | null
  }

  export type MentorSessionNoteSumAggregateOutputType = {
    callNumber: number | null
  }

  export type MentorSessionNoteMinAggregateOutputType = {
    id: string | null
    userId: string | null
    callNumber: number | null
    notes: string | null
    mentorId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type MentorSessionNoteMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    callNumber: number | null
    notes: string | null
    mentorId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type MentorSessionNoteCountAggregateOutputType = {
    id: number
    userId: number
    callNumber: number
    notes: number
    mentorId: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type MentorSessionNoteAvgAggregateInputType = {
    callNumber?: true
  }

  export type MentorSessionNoteSumAggregateInputType = {
    callNumber?: true
  }

  export type MentorSessionNoteMinAggregateInputType = {
    id?: true
    userId?: true
    callNumber?: true
    notes?: true
    mentorId?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type MentorSessionNoteMaxAggregateInputType = {
    id?: true
    userId?: true
    callNumber?: true
    notes?: true
    mentorId?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type MentorSessionNoteCountAggregateInputType = {
    id?: true
    userId?: true
    callNumber?: true
    notes?: true
    mentorId?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type MentorSessionNoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MentorSessionNote to aggregate.
     */
    where?: MentorSessionNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MentorSessionNotes to fetch.
     */
    orderBy?: MentorSessionNoteOrderByWithRelationInput | MentorSessionNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MentorSessionNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MentorSessionNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MentorSessionNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MentorSessionNotes
    **/
    _count?: true | MentorSessionNoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MentorSessionNoteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MentorSessionNoteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MentorSessionNoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MentorSessionNoteMaxAggregateInputType
  }

  export type GetMentorSessionNoteAggregateType<T extends MentorSessionNoteAggregateArgs> = {
        [P in keyof T & keyof AggregateMentorSessionNote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMentorSessionNote[P]>
      : GetScalarType<T[P], AggregateMentorSessionNote[P]>
  }




  export type MentorSessionNoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MentorSessionNoteWhereInput
    orderBy?: MentorSessionNoteOrderByWithAggregationInput | MentorSessionNoteOrderByWithAggregationInput[]
    by: MentorSessionNoteScalarFieldEnum[] | MentorSessionNoteScalarFieldEnum
    having?: MentorSessionNoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MentorSessionNoteCountAggregateInputType | true
    _avg?: MentorSessionNoteAvgAggregateInputType
    _sum?: MentorSessionNoteSumAggregateInputType
    _min?: MentorSessionNoteMinAggregateInputType
    _max?: MentorSessionNoteMaxAggregateInputType
  }

  export type MentorSessionNoteGroupByOutputType = {
    id: string
    userId: string
    callNumber: number
    notes: string
    mentorId: string | null
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: MentorSessionNoteCountAggregateOutputType | null
    _avg: MentorSessionNoteAvgAggregateOutputType | null
    _sum: MentorSessionNoteSumAggregateOutputType | null
    _min: MentorSessionNoteMinAggregateOutputType | null
    _max: MentorSessionNoteMaxAggregateOutputType | null
  }

  type GetMentorSessionNoteGroupByPayload<T extends MentorSessionNoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MentorSessionNoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MentorSessionNoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MentorSessionNoteGroupByOutputType[P]>
            : GetScalarType<T[P], MentorSessionNoteGroupByOutputType[P]>
        }
      >
    >


  export type MentorSessionNoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    callNumber?: boolean
    notes?: boolean
    mentorId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }, ExtArgs["result"]["mentorSessionNote"]>

  export type MentorSessionNoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    callNumber?: boolean
    notes?: boolean
    mentorId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }, ExtArgs["result"]["mentorSessionNote"]>

  export type MentorSessionNoteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    callNumber?: boolean
    notes?: boolean
    mentorId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }, ExtArgs["result"]["mentorSessionNote"]>

  export type MentorSessionNoteSelectScalar = {
    id?: boolean
    userId?: boolean
    callNumber?: boolean
    notes?: boolean
    mentorId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type MentorSessionNoteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "callNumber" | "notes" | "mentorId" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["mentorSessionNote"]>

  export type $MentorSessionNotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MentorSessionNote"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      callNumber: number
      notes: string
      mentorId: string | null
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["mentorSessionNote"]>
    composites: {}
  }

  type MentorSessionNoteGetPayload<S extends boolean | null | undefined | MentorSessionNoteDefaultArgs> = $Result.GetResult<Prisma.$MentorSessionNotePayload, S>

  type MentorSessionNoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MentorSessionNoteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MentorSessionNoteCountAggregateInputType | true
    }

  export interface MentorSessionNoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MentorSessionNote'], meta: { name: 'MentorSessionNote' } }
    /**
     * Find zero or one MentorSessionNote that matches the filter.
     * @param {MentorSessionNoteFindUniqueArgs} args - Arguments to find a MentorSessionNote
     * @example
     * // Get one MentorSessionNote
     * const mentorSessionNote = await prisma.mentorSessionNote.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MentorSessionNoteFindUniqueArgs>(args: SelectSubset<T, MentorSessionNoteFindUniqueArgs<ExtArgs>>): Prisma__MentorSessionNoteClient<$Result.GetResult<Prisma.$MentorSessionNotePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MentorSessionNote that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MentorSessionNoteFindUniqueOrThrowArgs} args - Arguments to find a MentorSessionNote
     * @example
     * // Get one MentorSessionNote
     * const mentorSessionNote = await prisma.mentorSessionNote.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MentorSessionNoteFindUniqueOrThrowArgs>(args: SelectSubset<T, MentorSessionNoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MentorSessionNoteClient<$Result.GetResult<Prisma.$MentorSessionNotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MentorSessionNote that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentorSessionNoteFindFirstArgs} args - Arguments to find a MentorSessionNote
     * @example
     * // Get one MentorSessionNote
     * const mentorSessionNote = await prisma.mentorSessionNote.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MentorSessionNoteFindFirstArgs>(args?: SelectSubset<T, MentorSessionNoteFindFirstArgs<ExtArgs>>): Prisma__MentorSessionNoteClient<$Result.GetResult<Prisma.$MentorSessionNotePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MentorSessionNote that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentorSessionNoteFindFirstOrThrowArgs} args - Arguments to find a MentorSessionNote
     * @example
     * // Get one MentorSessionNote
     * const mentorSessionNote = await prisma.mentorSessionNote.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MentorSessionNoteFindFirstOrThrowArgs>(args?: SelectSubset<T, MentorSessionNoteFindFirstOrThrowArgs<ExtArgs>>): Prisma__MentorSessionNoteClient<$Result.GetResult<Prisma.$MentorSessionNotePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MentorSessionNotes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentorSessionNoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MentorSessionNotes
     * const mentorSessionNotes = await prisma.mentorSessionNote.findMany()
     * 
     * // Get first 10 MentorSessionNotes
     * const mentorSessionNotes = await prisma.mentorSessionNote.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mentorSessionNoteWithIdOnly = await prisma.mentorSessionNote.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MentorSessionNoteFindManyArgs>(args?: SelectSubset<T, MentorSessionNoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MentorSessionNotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MentorSessionNote.
     * @param {MentorSessionNoteCreateArgs} args - Arguments to create a MentorSessionNote.
     * @example
     * // Create one MentorSessionNote
     * const MentorSessionNote = await prisma.mentorSessionNote.create({
     *   data: {
     *     // ... data to create a MentorSessionNote
     *   }
     * })
     * 
     */
    create<T extends MentorSessionNoteCreateArgs>(args: SelectSubset<T, MentorSessionNoteCreateArgs<ExtArgs>>): Prisma__MentorSessionNoteClient<$Result.GetResult<Prisma.$MentorSessionNotePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MentorSessionNotes.
     * @param {MentorSessionNoteCreateManyArgs} args - Arguments to create many MentorSessionNotes.
     * @example
     * // Create many MentorSessionNotes
     * const mentorSessionNote = await prisma.mentorSessionNote.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MentorSessionNoteCreateManyArgs>(args?: SelectSubset<T, MentorSessionNoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MentorSessionNotes and returns the data saved in the database.
     * @param {MentorSessionNoteCreateManyAndReturnArgs} args - Arguments to create many MentorSessionNotes.
     * @example
     * // Create many MentorSessionNotes
     * const mentorSessionNote = await prisma.mentorSessionNote.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MentorSessionNotes and only return the `id`
     * const mentorSessionNoteWithIdOnly = await prisma.mentorSessionNote.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MentorSessionNoteCreateManyAndReturnArgs>(args?: SelectSubset<T, MentorSessionNoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MentorSessionNotePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MentorSessionNote.
     * @param {MentorSessionNoteDeleteArgs} args - Arguments to delete one MentorSessionNote.
     * @example
     * // Delete one MentorSessionNote
     * const MentorSessionNote = await prisma.mentorSessionNote.delete({
     *   where: {
     *     // ... filter to delete one MentorSessionNote
     *   }
     * })
     * 
     */
    delete<T extends MentorSessionNoteDeleteArgs>(args: SelectSubset<T, MentorSessionNoteDeleteArgs<ExtArgs>>): Prisma__MentorSessionNoteClient<$Result.GetResult<Prisma.$MentorSessionNotePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MentorSessionNote.
     * @param {MentorSessionNoteUpdateArgs} args - Arguments to update one MentorSessionNote.
     * @example
     * // Update one MentorSessionNote
     * const mentorSessionNote = await prisma.mentorSessionNote.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MentorSessionNoteUpdateArgs>(args: SelectSubset<T, MentorSessionNoteUpdateArgs<ExtArgs>>): Prisma__MentorSessionNoteClient<$Result.GetResult<Prisma.$MentorSessionNotePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MentorSessionNotes.
     * @param {MentorSessionNoteDeleteManyArgs} args - Arguments to filter MentorSessionNotes to delete.
     * @example
     * // Delete a few MentorSessionNotes
     * const { count } = await prisma.mentorSessionNote.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MentorSessionNoteDeleteManyArgs>(args?: SelectSubset<T, MentorSessionNoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MentorSessionNotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentorSessionNoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MentorSessionNotes
     * const mentorSessionNote = await prisma.mentorSessionNote.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MentorSessionNoteUpdateManyArgs>(args: SelectSubset<T, MentorSessionNoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MentorSessionNotes and returns the data updated in the database.
     * @param {MentorSessionNoteUpdateManyAndReturnArgs} args - Arguments to update many MentorSessionNotes.
     * @example
     * // Update many MentorSessionNotes
     * const mentorSessionNote = await prisma.mentorSessionNote.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MentorSessionNotes and only return the `id`
     * const mentorSessionNoteWithIdOnly = await prisma.mentorSessionNote.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MentorSessionNoteUpdateManyAndReturnArgs>(args: SelectSubset<T, MentorSessionNoteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MentorSessionNotePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MentorSessionNote.
     * @param {MentorSessionNoteUpsertArgs} args - Arguments to update or create a MentorSessionNote.
     * @example
     * // Update or create a MentorSessionNote
     * const mentorSessionNote = await prisma.mentorSessionNote.upsert({
     *   create: {
     *     // ... data to create a MentorSessionNote
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MentorSessionNote we want to update
     *   }
     * })
     */
    upsert<T extends MentorSessionNoteUpsertArgs>(args: SelectSubset<T, MentorSessionNoteUpsertArgs<ExtArgs>>): Prisma__MentorSessionNoteClient<$Result.GetResult<Prisma.$MentorSessionNotePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MentorSessionNotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentorSessionNoteCountArgs} args - Arguments to filter MentorSessionNotes to count.
     * @example
     * // Count the number of MentorSessionNotes
     * const count = await prisma.mentorSessionNote.count({
     *   where: {
     *     // ... the filter for the MentorSessionNotes we want to count
     *   }
     * })
    **/
    count<T extends MentorSessionNoteCountArgs>(
      args?: Subset<T, MentorSessionNoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MentorSessionNoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MentorSessionNote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentorSessionNoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MentorSessionNoteAggregateArgs>(args: Subset<T, MentorSessionNoteAggregateArgs>): Prisma.PrismaPromise<GetMentorSessionNoteAggregateType<T>>

    /**
     * Group by MentorSessionNote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentorSessionNoteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MentorSessionNoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MentorSessionNoteGroupByArgs['orderBy'] }
        : { orderBy?: MentorSessionNoteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MentorSessionNoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMentorSessionNoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MentorSessionNote model
   */
  readonly fields: MentorSessionNoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MentorSessionNote.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MentorSessionNoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MentorSessionNote model
   */
  interface MentorSessionNoteFieldRefs {
    readonly id: FieldRef<"MentorSessionNote", 'String'>
    readonly userId: FieldRef<"MentorSessionNote", 'String'>
    readonly callNumber: FieldRef<"MentorSessionNote", 'Int'>
    readonly notes: FieldRef<"MentorSessionNote", 'String'>
    readonly mentorId: FieldRef<"MentorSessionNote", 'String'>
    readonly createdAt: FieldRef<"MentorSessionNote", 'DateTime'>
    readonly updatedAt: FieldRef<"MentorSessionNote", 'DateTime'>
    readonly deletedAt: FieldRef<"MentorSessionNote", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MentorSessionNote findUnique
   */
  export type MentorSessionNoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentorSessionNote
     */
    select?: MentorSessionNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MentorSessionNote
     */
    omit?: MentorSessionNoteOmit<ExtArgs> | null
    /**
     * Filter, which MentorSessionNote to fetch.
     */
    where: MentorSessionNoteWhereUniqueInput
  }

  /**
   * MentorSessionNote findUniqueOrThrow
   */
  export type MentorSessionNoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentorSessionNote
     */
    select?: MentorSessionNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MentorSessionNote
     */
    omit?: MentorSessionNoteOmit<ExtArgs> | null
    /**
     * Filter, which MentorSessionNote to fetch.
     */
    where: MentorSessionNoteWhereUniqueInput
  }

  /**
   * MentorSessionNote findFirst
   */
  export type MentorSessionNoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentorSessionNote
     */
    select?: MentorSessionNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MentorSessionNote
     */
    omit?: MentorSessionNoteOmit<ExtArgs> | null
    /**
     * Filter, which MentorSessionNote to fetch.
     */
    where?: MentorSessionNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MentorSessionNotes to fetch.
     */
    orderBy?: MentorSessionNoteOrderByWithRelationInput | MentorSessionNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MentorSessionNotes.
     */
    cursor?: MentorSessionNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MentorSessionNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MentorSessionNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MentorSessionNotes.
     */
    distinct?: MentorSessionNoteScalarFieldEnum | MentorSessionNoteScalarFieldEnum[]
  }

  /**
   * MentorSessionNote findFirstOrThrow
   */
  export type MentorSessionNoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentorSessionNote
     */
    select?: MentorSessionNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MentorSessionNote
     */
    omit?: MentorSessionNoteOmit<ExtArgs> | null
    /**
     * Filter, which MentorSessionNote to fetch.
     */
    where?: MentorSessionNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MentorSessionNotes to fetch.
     */
    orderBy?: MentorSessionNoteOrderByWithRelationInput | MentorSessionNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MentorSessionNotes.
     */
    cursor?: MentorSessionNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MentorSessionNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MentorSessionNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MentorSessionNotes.
     */
    distinct?: MentorSessionNoteScalarFieldEnum | MentorSessionNoteScalarFieldEnum[]
  }

  /**
   * MentorSessionNote findMany
   */
  export type MentorSessionNoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentorSessionNote
     */
    select?: MentorSessionNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MentorSessionNote
     */
    omit?: MentorSessionNoteOmit<ExtArgs> | null
    /**
     * Filter, which MentorSessionNotes to fetch.
     */
    where?: MentorSessionNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MentorSessionNotes to fetch.
     */
    orderBy?: MentorSessionNoteOrderByWithRelationInput | MentorSessionNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MentorSessionNotes.
     */
    cursor?: MentorSessionNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MentorSessionNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MentorSessionNotes.
     */
    skip?: number
    distinct?: MentorSessionNoteScalarFieldEnum | MentorSessionNoteScalarFieldEnum[]
  }

  /**
   * MentorSessionNote create
   */
  export type MentorSessionNoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentorSessionNote
     */
    select?: MentorSessionNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MentorSessionNote
     */
    omit?: MentorSessionNoteOmit<ExtArgs> | null
    /**
     * The data needed to create a MentorSessionNote.
     */
    data: XOR<MentorSessionNoteCreateInput, MentorSessionNoteUncheckedCreateInput>
  }

  /**
   * MentorSessionNote createMany
   */
  export type MentorSessionNoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MentorSessionNotes.
     */
    data: MentorSessionNoteCreateManyInput | MentorSessionNoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MentorSessionNote createManyAndReturn
   */
  export type MentorSessionNoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentorSessionNote
     */
    select?: MentorSessionNoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MentorSessionNote
     */
    omit?: MentorSessionNoteOmit<ExtArgs> | null
    /**
     * The data used to create many MentorSessionNotes.
     */
    data: MentorSessionNoteCreateManyInput | MentorSessionNoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MentorSessionNote update
   */
  export type MentorSessionNoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentorSessionNote
     */
    select?: MentorSessionNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MentorSessionNote
     */
    omit?: MentorSessionNoteOmit<ExtArgs> | null
    /**
     * The data needed to update a MentorSessionNote.
     */
    data: XOR<MentorSessionNoteUpdateInput, MentorSessionNoteUncheckedUpdateInput>
    /**
     * Choose, which MentorSessionNote to update.
     */
    where: MentorSessionNoteWhereUniqueInput
  }

  /**
   * MentorSessionNote updateMany
   */
  export type MentorSessionNoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MentorSessionNotes.
     */
    data: XOR<MentorSessionNoteUpdateManyMutationInput, MentorSessionNoteUncheckedUpdateManyInput>
    /**
     * Filter which MentorSessionNotes to update
     */
    where?: MentorSessionNoteWhereInput
    /**
     * Limit how many MentorSessionNotes to update.
     */
    limit?: number
  }

  /**
   * MentorSessionNote updateManyAndReturn
   */
  export type MentorSessionNoteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentorSessionNote
     */
    select?: MentorSessionNoteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MentorSessionNote
     */
    omit?: MentorSessionNoteOmit<ExtArgs> | null
    /**
     * The data used to update MentorSessionNotes.
     */
    data: XOR<MentorSessionNoteUpdateManyMutationInput, MentorSessionNoteUncheckedUpdateManyInput>
    /**
     * Filter which MentorSessionNotes to update
     */
    where?: MentorSessionNoteWhereInput
    /**
     * Limit how many MentorSessionNotes to update.
     */
    limit?: number
  }

  /**
   * MentorSessionNote upsert
   */
  export type MentorSessionNoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentorSessionNote
     */
    select?: MentorSessionNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MentorSessionNote
     */
    omit?: MentorSessionNoteOmit<ExtArgs> | null
    /**
     * The filter to search for the MentorSessionNote to update in case it exists.
     */
    where: MentorSessionNoteWhereUniqueInput
    /**
     * In case the MentorSessionNote found by the `where` argument doesn't exist, create a new MentorSessionNote with this data.
     */
    create: XOR<MentorSessionNoteCreateInput, MentorSessionNoteUncheckedCreateInput>
    /**
     * In case the MentorSessionNote was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MentorSessionNoteUpdateInput, MentorSessionNoteUncheckedUpdateInput>
  }

  /**
   * MentorSessionNote delete
   */
  export type MentorSessionNoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentorSessionNote
     */
    select?: MentorSessionNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MentorSessionNote
     */
    omit?: MentorSessionNoteOmit<ExtArgs> | null
    /**
     * Filter which MentorSessionNote to delete.
     */
    where: MentorSessionNoteWhereUniqueInput
  }

  /**
   * MentorSessionNote deleteMany
   */
  export type MentorSessionNoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MentorSessionNotes to delete
     */
    where?: MentorSessionNoteWhereInput
    /**
     * Limit how many MentorSessionNotes to delete.
     */
    limit?: number
  }

  /**
   * MentorSessionNote without action
   */
  export type MentorSessionNoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentorSessionNote
     */
    select?: MentorSessionNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MentorSessionNote
     */
    omit?: MentorSessionNoteOmit<ExtArgs> | null
  }


  /**
   * Model UserStatus
   */

  export type AggregateUserStatus = {
    _count: UserStatusCountAggregateOutputType | null
    _min: UserStatusMinAggregateOutputType | null
    _max: UserStatusMaxAggregateOutputType | null
  }

  export type UserStatusMinAggregateOutputType = {
    id: string | null
    userId: string | null
    orientation: boolean | null
    resumeRebuilding: boolean | null
    eligibleForFirstMentorCall: boolean | null
    resumeConfirmed: boolean | null
    portfolioBuildingAndConfirmed: boolean | null
    eligibleForSecondMentorCall: boolean | null
    paymentMade: boolean | null
    techDistributionAndExtension: boolean | null
    eligibleForThirdMentorCall: boolean | null
    cheatSheetBuiltOut: boolean | null
    hasAppliedEnoughJobs: boolean | null
    eligibleForFourthMentorCall: boolean | null
    eligibleForFifthMentorCall: boolean | null
    fourthMentorCallCompletedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
    fifthMentorCallCompletedAt: Date | null
    firstMentorCallCompletedAt: Date | null
    secondMentorCallCompletedAt: Date | null
    thirdMentorCallCompletedAt: Date | null
    fifthMentorCallGoogleMeetLink: string | null
    fifthMentorCallScheduledAt: Date | null
    finalReview: boolean | null
    firstMentorCallGoogleMeetLink: string | null
    firstMentorCallScheduledAt: Date | null
    fourthMentorCallGoogleMeetLink: string | null
    fourthMentorCallScheduledAt: Date | null
    secondMentorCallGoogleMeetLink: string | null
    secondMentorCallScheduledAt: Date | null
    thirdMentorCallGoogleMeetLink: string | null
    thirdMentorCallScheduledAt: Date | null
  }

  export type UserStatusMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    orientation: boolean | null
    resumeRebuilding: boolean | null
    eligibleForFirstMentorCall: boolean | null
    resumeConfirmed: boolean | null
    portfolioBuildingAndConfirmed: boolean | null
    eligibleForSecondMentorCall: boolean | null
    paymentMade: boolean | null
    techDistributionAndExtension: boolean | null
    eligibleForThirdMentorCall: boolean | null
    cheatSheetBuiltOut: boolean | null
    hasAppliedEnoughJobs: boolean | null
    eligibleForFourthMentorCall: boolean | null
    eligibleForFifthMentorCall: boolean | null
    fourthMentorCallCompletedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
    fifthMentorCallCompletedAt: Date | null
    firstMentorCallCompletedAt: Date | null
    secondMentorCallCompletedAt: Date | null
    thirdMentorCallCompletedAt: Date | null
    fifthMentorCallGoogleMeetLink: string | null
    fifthMentorCallScheduledAt: Date | null
    finalReview: boolean | null
    firstMentorCallGoogleMeetLink: string | null
    firstMentorCallScheduledAt: Date | null
    fourthMentorCallGoogleMeetLink: string | null
    fourthMentorCallScheduledAt: Date | null
    secondMentorCallGoogleMeetLink: string | null
    secondMentorCallScheduledAt: Date | null
    thirdMentorCallGoogleMeetLink: string | null
    thirdMentorCallScheduledAt: Date | null
  }

  export type UserStatusCountAggregateOutputType = {
    id: number
    userId: number
    orientation: number
    resumeRebuilding: number
    eligibleForFirstMentorCall: number
    resumeConfirmed: number
    portfolioBuildingAndConfirmed: number
    eligibleForSecondMentorCall: number
    paymentMade: number
    techDistributionAndExtension: number
    eligibleForThirdMentorCall: number
    cheatSheetBuiltOut: number
    hasAppliedEnoughJobs: number
    eligibleForFourthMentorCall: number
    eligibleForFifthMentorCall: number
    fourthMentorCallCompletedAt: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    fifthMentorCallCompletedAt: number
    firstMentorCallCompletedAt: number
    secondMentorCallCompletedAt: number
    thirdMentorCallCompletedAt: number
    fifthMentorCallGoogleMeetLink: number
    fifthMentorCallScheduledAt: number
    finalReview: number
    firstMentorCallGoogleMeetLink: number
    firstMentorCallScheduledAt: number
    fourthMentorCallGoogleMeetLink: number
    fourthMentorCallScheduledAt: number
    secondMentorCallGoogleMeetLink: number
    secondMentorCallScheduledAt: number
    thirdMentorCallGoogleMeetLink: number
    thirdMentorCallScheduledAt: number
    _all: number
  }


  export type UserStatusMinAggregateInputType = {
    id?: true
    userId?: true
    orientation?: true
    resumeRebuilding?: true
    eligibleForFirstMentorCall?: true
    resumeConfirmed?: true
    portfolioBuildingAndConfirmed?: true
    eligibleForSecondMentorCall?: true
    paymentMade?: true
    techDistributionAndExtension?: true
    eligibleForThirdMentorCall?: true
    cheatSheetBuiltOut?: true
    hasAppliedEnoughJobs?: true
    eligibleForFourthMentorCall?: true
    eligibleForFifthMentorCall?: true
    fourthMentorCallCompletedAt?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    fifthMentorCallCompletedAt?: true
    firstMentorCallCompletedAt?: true
    secondMentorCallCompletedAt?: true
    thirdMentorCallCompletedAt?: true
    fifthMentorCallGoogleMeetLink?: true
    fifthMentorCallScheduledAt?: true
    finalReview?: true
    firstMentorCallGoogleMeetLink?: true
    firstMentorCallScheduledAt?: true
    fourthMentorCallGoogleMeetLink?: true
    fourthMentorCallScheduledAt?: true
    secondMentorCallGoogleMeetLink?: true
    secondMentorCallScheduledAt?: true
    thirdMentorCallGoogleMeetLink?: true
    thirdMentorCallScheduledAt?: true
  }

  export type UserStatusMaxAggregateInputType = {
    id?: true
    userId?: true
    orientation?: true
    resumeRebuilding?: true
    eligibleForFirstMentorCall?: true
    resumeConfirmed?: true
    portfolioBuildingAndConfirmed?: true
    eligibleForSecondMentorCall?: true
    paymentMade?: true
    techDistributionAndExtension?: true
    eligibleForThirdMentorCall?: true
    cheatSheetBuiltOut?: true
    hasAppliedEnoughJobs?: true
    eligibleForFourthMentorCall?: true
    eligibleForFifthMentorCall?: true
    fourthMentorCallCompletedAt?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    fifthMentorCallCompletedAt?: true
    firstMentorCallCompletedAt?: true
    secondMentorCallCompletedAt?: true
    thirdMentorCallCompletedAt?: true
    fifthMentorCallGoogleMeetLink?: true
    fifthMentorCallScheduledAt?: true
    finalReview?: true
    firstMentorCallGoogleMeetLink?: true
    firstMentorCallScheduledAt?: true
    fourthMentorCallGoogleMeetLink?: true
    fourthMentorCallScheduledAt?: true
    secondMentorCallGoogleMeetLink?: true
    secondMentorCallScheduledAt?: true
    thirdMentorCallGoogleMeetLink?: true
    thirdMentorCallScheduledAt?: true
  }

  export type UserStatusCountAggregateInputType = {
    id?: true
    userId?: true
    orientation?: true
    resumeRebuilding?: true
    eligibleForFirstMentorCall?: true
    resumeConfirmed?: true
    portfolioBuildingAndConfirmed?: true
    eligibleForSecondMentorCall?: true
    paymentMade?: true
    techDistributionAndExtension?: true
    eligibleForThirdMentorCall?: true
    cheatSheetBuiltOut?: true
    hasAppliedEnoughJobs?: true
    eligibleForFourthMentorCall?: true
    eligibleForFifthMentorCall?: true
    fourthMentorCallCompletedAt?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    fifthMentorCallCompletedAt?: true
    firstMentorCallCompletedAt?: true
    secondMentorCallCompletedAt?: true
    thirdMentorCallCompletedAt?: true
    fifthMentorCallGoogleMeetLink?: true
    fifthMentorCallScheduledAt?: true
    finalReview?: true
    firstMentorCallGoogleMeetLink?: true
    firstMentorCallScheduledAt?: true
    fourthMentorCallGoogleMeetLink?: true
    fourthMentorCallScheduledAt?: true
    secondMentorCallGoogleMeetLink?: true
    secondMentorCallScheduledAt?: true
    thirdMentorCallGoogleMeetLink?: true
    thirdMentorCallScheduledAt?: true
    _all?: true
  }

  export type UserStatusAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserStatus to aggregate.
     */
    where?: UserStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserStatuses to fetch.
     */
    orderBy?: UserStatusOrderByWithRelationInput | UserStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserStatuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserStatuses
    **/
    _count?: true | UserStatusCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserStatusMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserStatusMaxAggregateInputType
  }

  export type GetUserStatusAggregateType<T extends UserStatusAggregateArgs> = {
        [P in keyof T & keyof AggregateUserStatus]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserStatus[P]>
      : GetScalarType<T[P], AggregateUserStatus[P]>
  }




  export type UserStatusGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserStatusWhereInput
    orderBy?: UserStatusOrderByWithAggregationInput | UserStatusOrderByWithAggregationInput[]
    by: UserStatusScalarFieldEnum[] | UserStatusScalarFieldEnum
    having?: UserStatusScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserStatusCountAggregateInputType | true
    _min?: UserStatusMinAggregateInputType
    _max?: UserStatusMaxAggregateInputType
  }

  export type UserStatusGroupByOutputType = {
    id: string
    userId: string
    orientation: boolean
    resumeRebuilding: boolean
    eligibleForFirstMentorCall: boolean
    resumeConfirmed: boolean
    portfolioBuildingAndConfirmed: boolean
    eligibleForSecondMentorCall: boolean
    paymentMade: boolean
    techDistributionAndExtension: boolean
    eligibleForThirdMentorCall: boolean
    cheatSheetBuiltOut: boolean
    hasAppliedEnoughJobs: boolean
    eligibleForFourthMentorCall: boolean
    eligibleForFifthMentorCall: boolean
    fourthMentorCallCompletedAt: Date | null
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    fifthMentorCallCompletedAt: Date | null
    firstMentorCallCompletedAt: Date | null
    secondMentorCallCompletedAt: Date | null
    thirdMentorCallCompletedAt: Date | null
    fifthMentorCallGoogleMeetLink: string | null
    fifthMentorCallScheduledAt: Date | null
    finalReview: boolean
    firstMentorCallGoogleMeetLink: string | null
    firstMentorCallScheduledAt: Date | null
    fourthMentorCallGoogleMeetLink: string | null
    fourthMentorCallScheduledAt: Date | null
    secondMentorCallGoogleMeetLink: string | null
    secondMentorCallScheduledAt: Date | null
    thirdMentorCallGoogleMeetLink: string | null
    thirdMentorCallScheduledAt: Date | null
    _count: UserStatusCountAggregateOutputType | null
    _min: UserStatusMinAggregateOutputType | null
    _max: UserStatusMaxAggregateOutputType | null
  }

  type GetUserStatusGroupByPayload<T extends UserStatusGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserStatusGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserStatusGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserStatusGroupByOutputType[P]>
            : GetScalarType<T[P], UserStatusGroupByOutputType[P]>
        }
      >
    >


  export type UserStatusSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    orientation?: boolean
    resumeRebuilding?: boolean
    eligibleForFirstMentorCall?: boolean
    resumeConfirmed?: boolean
    portfolioBuildingAndConfirmed?: boolean
    eligibleForSecondMentorCall?: boolean
    paymentMade?: boolean
    techDistributionAndExtension?: boolean
    eligibleForThirdMentorCall?: boolean
    cheatSheetBuiltOut?: boolean
    hasAppliedEnoughJobs?: boolean
    eligibleForFourthMentorCall?: boolean
    eligibleForFifthMentorCall?: boolean
    fourthMentorCallCompletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    fifthMentorCallCompletedAt?: boolean
    firstMentorCallCompletedAt?: boolean
    secondMentorCallCompletedAt?: boolean
    thirdMentorCallCompletedAt?: boolean
    fifthMentorCallGoogleMeetLink?: boolean
    fifthMentorCallScheduledAt?: boolean
    finalReview?: boolean
    firstMentorCallGoogleMeetLink?: boolean
    firstMentorCallScheduledAt?: boolean
    fourthMentorCallGoogleMeetLink?: boolean
    fourthMentorCallScheduledAt?: boolean
    secondMentorCallGoogleMeetLink?: boolean
    secondMentorCallScheduledAt?: boolean
    thirdMentorCallGoogleMeetLink?: boolean
    thirdMentorCallScheduledAt?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userStatus"]>

  export type UserStatusSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    orientation?: boolean
    resumeRebuilding?: boolean
    eligibleForFirstMentorCall?: boolean
    resumeConfirmed?: boolean
    portfolioBuildingAndConfirmed?: boolean
    eligibleForSecondMentorCall?: boolean
    paymentMade?: boolean
    techDistributionAndExtension?: boolean
    eligibleForThirdMentorCall?: boolean
    cheatSheetBuiltOut?: boolean
    hasAppliedEnoughJobs?: boolean
    eligibleForFourthMentorCall?: boolean
    eligibleForFifthMentorCall?: boolean
    fourthMentorCallCompletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    fifthMentorCallCompletedAt?: boolean
    firstMentorCallCompletedAt?: boolean
    secondMentorCallCompletedAt?: boolean
    thirdMentorCallCompletedAt?: boolean
    fifthMentorCallGoogleMeetLink?: boolean
    fifthMentorCallScheduledAt?: boolean
    finalReview?: boolean
    firstMentorCallGoogleMeetLink?: boolean
    firstMentorCallScheduledAt?: boolean
    fourthMentorCallGoogleMeetLink?: boolean
    fourthMentorCallScheduledAt?: boolean
    secondMentorCallGoogleMeetLink?: boolean
    secondMentorCallScheduledAt?: boolean
    thirdMentorCallGoogleMeetLink?: boolean
    thirdMentorCallScheduledAt?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userStatus"]>

  export type UserStatusSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    orientation?: boolean
    resumeRebuilding?: boolean
    eligibleForFirstMentorCall?: boolean
    resumeConfirmed?: boolean
    portfolioBuildingAndConfirmed?: boolean
    eligibleForSecondMentorCall?: boolean
    paymentMade?: boolean
    techDistributionAndExtension?: boolean
    eligibleForThirdMentorCall?: boolean
    cheatSheetBuiltOut?: boolean
    hasAppliedEnoughJobs?: boolean
    eligibleForFourthMentorCall?: boolean
    eligibleForFifthMentorCall?: boolean
    fourthMentorCallCompletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    fifthMentorCallCompletedAt?: boolean
    firstMentorCallCompletedAt?: boolean
    secondMentorCallCompletedAt?: boolean
    thirdMentorCallCompletedAt?: boolean
    fifthMentorCallGoogleMeetLink?: boolean
    fifthMentorCallScheduledAt?: boolean
    finalReview?: boolean
    firstMentorCallGoogleMeetLink?: boolean
    firstMentorCallScheduledAt?: boolean
    fourthMentorCallGoogleMeetLink?: boolean
    fourthMentorCallScheduledAt?: boolean
    secondMentorCallGoogleMeetLink?: boolean
    secondMentorCallScheduledAt?: boolean
    thirdMentorCallGoogleMeetLink?: boolean
    thirdMentorCallScheduledAt?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userStatus"]>

  export type UserStatusSelectScalar = {
    id?: boolean
    userId?: boolean
    orientation?: boolean
    resumeRebuilding?: boolean
    eligibleForFirstMentorCall?: boolean
    resumeConfirmed?: boolean
    portfolioBuildingAndConfirmed?: boolean
    eligibleForSecondMentorCall?: boolean
    paymentMade?: boolean
    techDistributionAndExtension?: boolean
    eligibleForThirdMentorCall?: boolean
    cheatSheetBuiltOut?: boolean
    hasAppliedEnoughJobs?: boolean
    eligibleForFourthMentorCall?: boolean
    eligibleForFifthMentorCall?: boolean
    fourthMentorCallCompletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    fifthMentorCallCompletedAt?: boolean
    firstMentorCallCompletedAt?: boolean
    secondMentorCallCompletedAt?: boolean
    thirdMentorCallCompletedAt?: boolean
    fifthMentorCallGoogleMeetLink?: boolean
    fifthMentorCallScheduledAt?: boolean
    finalReview?: boolean
    firstMentorCallGoogleMeetLink?: boolean
    firstMentorCallScheduledAt?: boolean
    fourthMentorCallGoogleMeetLink?: boolean
    fourthMentorCallScheduledAt?: boolean
    secondMentorCallGoogleMeetLink?: boolean
    secondMentorCallScheduledAt?: boolean
    thirdMentorCallGoogleMeetLink?: boolean
    thirdMentorCallScheduledAt?: boolean
  }

  export type UserStatusOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "orientation" | "resumeRebuilding" | "eligibleForFirstMentorCall" | "resumeConfirmed" | "portfolioBuildingAndConfirmed" | "eligibleForSecondMentorCall" | "paymentMade" | "techDistributionAndExtension" | "eligibleForThirdMentorCall" | "cheatSheetBuiltOut" | "hasAppliedEnoughJobs" | "eligibleForFourthMentorCall" | "eligibleForFifthMentorCall" | "fourthMentorCallCompletedAt" | "createdAt" | "updatedAt" | "deletedAt" | "fifthMentorCallCompletedAt" | "firstMentorCallCompletedAt" | "secondMentorCallCompletedAt" | "thirdMentorCallCompletedAt" | "fifthMentorCallGoogleMeetLink" | "fifthMentorCallScheduledAt" | "finalReview" | "firstMentorCallGoogleMeetLink" | "firstMentorCallScheduledAt" | "fourthMentorCallGoogleMeetLink" | "fourthMentorCallScheduledAt" | "secondMentorCallGoogleMeetLink" | "secondMentorCallScheduledAt" | "thirdMentorCallGoogleMeetLink" | "thirdMentorCallScheduledAt", ExtArgs["result"]["userStatus"]>
  export type UserStatusInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserStatusIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserStatusIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserStatusPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserStatus"
    objects: {
      User: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      orientation: boolean
      resumeRebuilding: boolean
      eligibleForFirstMentorCall: boolean
      resumeConfirmed: boolean
      portfolioBuildingAndConfirmed: boolean
      eligibleForSecondMentorCall: boolean
      paymentMade: boolean
      techDistributionAndExtension: boolean
      eligibleForThirdMentorCall: boolean
      cheatSheetBuiltOut: boolean
      hasAppliedEnoughJobs: boolean
      eligibleForFourthMentorCall: boolean
      eligibleForFifthMentorCall: boolean
      fourthMentorCallCompletedAt: Date | null
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
      fifthMentorCallCompletedAt: Date | null
      firstMentorCallCompletedAt: Date | null
      secondMentorCallCompletedAt: Date | null
      thirdMentorCallCompletedAt: Date | null
      fifthMentorCallGoogleMeetLink: string | null
      fifthMentorCallScheduledAt: Date | null
      finalReview: boolean
      firstMentorCallGoogleMeetLink: string | null
      firstMentorCallScheduledAt: Date | null
      fourthMentorCallGoogleMeetLink: string | null
      fourthMentorCallScheduledAt: Date | null
      secondMentorCallGoogleMeetLink: string | null
      secondMentorCallScheduledAt: Date | null
      thirdMentorCallGoogleMeetLink: string | null
      thirdMentorCallScheduledAt: Date | null
    }, ExtArgs["result"]["userStatus"]>
    composites: {}
  }

  type UserStatusGetPayload<S extends boolean | null | undefined | UserStatusDefaultArgs> = $Result.GetResult<Prisma.$UserStatusPayload, S>

  type UserStatusCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserStatusFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserStatusCountAggregateInputType | true
    }

  export interface UserStatusDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserStatus'], meta: { name: 'UserStatus' } }
    /**
     * Find zero or one UserStatus that matches the filter.
     * @param {UserStatusFindUniqueArgs} args - Arguments to find a UserStatus
     * @example
     * // Get one UserStatus
     * const userStatus = await prisma.userStatus.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserStatusFindUniqueArgs>(args: SelectSubset<T, UserStatusFindUniqueArgs<ExtArgs>>): Prisma__UserStatusClient<$Result.GetResult<Prisma.$UserStatusPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserStatus that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserStatusFindUniqueOrThrowArgs} args - Arguments to find a UserStatus
     * @example
     * // Get one UserStatus
     * const userStatus = await prisma.userStatus.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserStatusFindUniqueOrThrowArgs>(args: SelectSubset<T, UserStatusFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserStatusClient<$Result.GetResult<Prisma.$UserStatusPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserStatus that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStatusFindFirstArgs} args - Arguments to find a UserStatus
     * @example
     * // Get one UserStatus
     * const userStatus = await prisma.userStatus.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserStatusFindFirstArgs>(args?: SelectSubset<T, UserStatusFindFirstArgs<ExtArgs>>): Prisma__UserStatusClient<$Result.GetResult<Prisma.$UserStatusPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserStatus that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStatusFindFirstOrThrowArgs} args - Arguments to find a UserStatus
     * @example
     * // Get one UserStatus
     * const userStatus = await prisma.userStatus.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserStatusFindFirstOrThrowArgs>(args?: SelectSubset<T, UserStatusFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserStatusClient<$Result.GetResult<Prisma.$UserStatusPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserStatuses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStatusFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserStatuses
     * const userStatuses = await prisma.userStatus.findMany()
     * 
     * // Get first 10 UserStatuses
     * const userStatuses = await prisma.userStatus.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userStatusWithIdOnly = await prisma.userStatus.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserStatusFindManyArgs>(args?: SelectSubset<T, UserStatusFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserStatusPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserStatus.
     * @param {UserStatusCreateArgs} args - Arguments to create a UserStatus.
     * @example
     * // Create one UserStatus
     * const UserStatus = await prisma.userStatus.create({
     *   data: {
     *     // ... data to create a UserStatus
     *   }
     * })
     * 
     */
    create<T extends UserStatusCreateArgs>(args: SelectSubset<T, UserStatusCreateArgs<ExtArgs>>): Prisma__UserStatusClient<$Result.GetResult<Prisma.$UserStatusPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserStatuses.
     * @param {UserStatusCreateManyArgs} args - Arguments to create many UserStatuses.
     * @example
     * // Create many UserStatuses
     * const userStatus = await prisma.userStatus.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserStatusCreateManyArgs>(args?: SelectSubset<T, UserStatusCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserStatuses and returns the data saved in the database.
     * @param {UserStatusCreateManyAndReturnArgs} args - Arguments to create many UserStatuses.
     * @example
     * // Create many UserStatuses
     * const userStatus = await prisma.userStatus.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserStatuses and only return the `id`
     * const userStatusWithIdOnly = await prisma.userStatus.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserStatusCreateManyAndReturnArgs>(args?: SelectSubset<T, UserStatusCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserStatusPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserStatus.
     * @param {UserStatusDeleteArgs} args - Arguments to delete one UserStatus.
     * @example
     * // Delete one UserStatus
     * const UserStatus = await prisma.userStatus.delete({
     *   where: {
     *     // ... filter to delete one UserStatus
     *   }
     * })
     * 
     */
    delete<T extends UserStatusDeleteArgs>(args: SelectSubset<T, UserStatusDeleteArgs<ExtArgs>>): Prisma__UserStatusClient<$Result.GetResult<Prisma.$UserStatusPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserStatus.
     * @param {UserStatusUpdateArgs} args - Arguments to update one UserStatus.
     * @example
     * // Update one UserStatus
     * const userStatus = await prisma.userStatus.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserStatusUpdateArgs>(args: SelectSubset<T, UserStatusUpdateArgs<ExtArgs>>): Prisma__UserStatusClient<$Result.GetResult<Prisma.$UserStatusPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserStatuses.
     * @param {UserStatusDeleteManyArgs} args - Arguments to filter UserStatuses to delete.
     * @example
     * // Delete a few UserStatuses
     * const { count } = await prisma.userStatus.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserStatusDeleteManyArgs>(args?: SelectSubset<T, UserStatusDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserStatuses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStatusUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserStatuses
     * const userStatus = await prisma.userStatus.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserStatusUpdateManyArgs>(args: SelectSubset<T, UserStatusUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserStatuses and returns the data updated in the database.
     * @param {UserStatusUpdateManyAndReturnArgs} args - Arguments to update many UserStatuses.
     * @example
     * // Update many UserStatuses
     * const userStatus = await prisma.userStatus.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserStatuses and only return the `id`
     * const userStatusWithIdOnly = await prisma.userStatus.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserStatusUpdateManyAndReturnArgs>(args: SelectSubset<T, UserStatusUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserStatusPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserStatus.
     * @param {UserStatusUpsertArgs} args - Arguments to update or create a UserStatus.
     * @example
     * // Update or create a UserStatus
     * const userStatus = await prisma.userStatus.upsert({
     *   create: {
     *     // ... data to create a UserStatus
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserStatus we want to update
     *   }
     * })
     */
    upsert<T extends UserStatusUpsertArgs>(args: SelectSubset<T, UserStatusUpsertArgs<ExtArgs>>): Prisma__UserStatusClient<$Result.GetResult<Prisma.$UserStatusPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserStatuses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStatusCountArgs} args - Arguments to filter UserStatuses to count.
     * @example
     * // Count the number of UserStatuses
     * const count = await prisma.userStatus.count({
     *   where: {
     *     // ... the filter for the UserStatuses we want to count
     *   }
     * })
    **/
    count<T extends UserStatusCountArgs>(
      args?: Subset<T, UserStatusCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserStatusCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserStatus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStatusAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserStatusAggregateArgs>(args: Subset<T, UserStatusAggregateArgs>): Prisma.PrismaPromise<GetUserStatusAggregateType<T>>

    /**
     * Group by UserStatus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStatusGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserStatusGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserStatusGroupByArgs['orderBy'] }
        : { orderBy?: UserStatusGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserStatusGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserStatusGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserStatus model
   */
  readonly fields: UserStatusFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserStatus.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserStatusClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    User<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserStatus model
   */
  interface UserStatusFieldRefs {
    readonly id: FieldRef<"UserStatus", 'String'>
    readonly userId: FieldRef<"UserStatus", 'String'>
    readonly orientation: FieldRef<"UserStatus", 'Boolean'>
    readonly resumeRebuilding: FieldRef<"UserStatus", 'Boolean'>
    readonly eligibleForFirstMentorCall: FieldRef<"UserStatus", 'Boolean'>
    readonly resumeConfirmed: FieldRef<"UserStatus", 'Boolean'>
    readonly portfolioBuildingAndConfirmed: FieldRef<"UserStatus", 'Boolean'>
    readonly eligibleForSecondMentorCall: FieldRef<"UserStatus", 'Boolean'>
    readonly paymentMade: FieldRef<"UserStatus", 'Boolean'>
    readonly techDistributionAndExtension: FieldRef<"UserStatus", 'Boolean'>
    readonly eligibleForThirdMentorCall: FieldRef<"UserStatus", 'Boolean'>
    readonly cheatSheetBuiltOut: FieldRef<"UserStatus", 'Boolean'>
    readonly hasAppliedEnoughJobs: FieldRef<"UserStatus", 'Boolean'>
    readonly eligibleForFourthMentorCall: FieldRef<"UserStatus", 'Boolean'>
    readonly eligibleForFifthMentorCall: FieldRef<"UserStatus", 'Boolean'>
    readonly fourthMentorCallCompletedAt: FieldRef<"UserStatus", 'DateTime'>
    readonly createdAt: FieldRef<"UserStatus", 'DateTime'>
    readonly updatedAt: FieldRef<"UserStatus", 'DateTime'>
    readonly deletedAt: FieldRef<"UserStatus", 'DateTime'>
    readonly fifthMentorCallCompletedAt: FieldRef<"UserStatus", 'DateTime'>
    readonly firstMentorCallCompletedAt: FieldRef<"UserStatus", 'DateTime'>
    readonly secondMentorCallCompletedAt: FieldRef<"UserStatus", 'DateTime'>
    readonly thirdMentorCallCompletedAt: FieldRef<"UserStatus", 'DateTime'>
    readonly fifthMentorCallGoogleMeetLink: FieldRef<"UserStatus", 'String'>
    readonly fifthMentorCallScheduledAt: FieldRef<"UserStatus", 'DateTime'>
    readonly finalReview: FieldRef<"UserStatus", 'Boolean'>
    readonly firstMentorCallGoogleMeetLink: FieldRef<"UserStatus", 'String'>
    readonly firstMentorCallScheduledAt: FieldRef<"UserStatus", 'DateTime'>
    readonly fourthMentorCallGoogleMeetLink: FieldRef<"UserStatus", 'String'>
    readonly fourthMentorCallScheduledAt: FieldRef<"UserStatus", 'DateTime'>
    readonly secondMentorCallGoogleMeetLink: FieldRef<"UserStatus", 'String'>
    readonly secondMentorCallScheduledAt: FieldRef<"UserStatus", 'DateTime'>
    readonly thirdMentorCallGoogleMeetLink: FieldRef<"UserStatus", 'String'>
    readonly thirdMentorCallScheduledAt: FieldRef<"UserStatus", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserStatus findUnique
   */
  export type UserStatusFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStatus
     */
    select?: UserStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStatus
     */
    omit?: UserStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatusInclude<ExtArgs> | null
    /**
     * Filter, which UserStatus to fetch.
     */
    where: UserStatusWhereUniqueInput
  }

  /**
   * UserStatus findUniqueOrThrow
   */
  export type UserStatusFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStatus
     */
    select?: UserStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStatus
     */
    omit?: UserStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatusInclude<ExtArgs> | null
    /**
     * Filter, which UserStatus to fetch.
     */
    where: UserStatusWhereUniqueInput
  }

  /**
   * UserStatus findFirst
   */
  export type UserStatusFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStatus
     */
    select?: UserStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStatus
     */
    omit?: UserStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatusInclude<ExtArgs> | null
    /**
     * Filter, which UserStatus to fetch.
     */
    where?: UserStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserStatuses to fetch.
     */
    orderBy?: UserStatusOrderByWithRelationInput | UserStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserStatuses.
     */
    cursor?: UserStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserStatuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserStatuses.
     */
    distinct?: UserStatusScalarFieldEnum | UserStatusScalarFieldEnum[]
  }

  /**
   * UserStatus findFirstOrThrow
   */
  export type UserStatusFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStatus
     */
    select?: UserStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStatus
     */
    omit?: UserStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatusInclude<ExtArgs> | null
    /**
     * Filter, which UserStatus to fetch.
     */
    where?: UserStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserStatuses to fetch.
     */
    orderBy?: UserStatusOrderByWithRelationInput | UserStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserStatuses.
     */
    cursor?: UserStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserStatuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserStatuses.
     */
    distinct?: UserStatusScalarFieldEnum | UserStatusScalarFieldEnum[]
  }

  /**
   * UserStatus findMany
   */
  export type UserStatusFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStatus
     */
    select?: UserStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStatus
     */
    omit?: UserStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatusInclude<ExtArgs> | null
    /**
     * Filter, which UserStatuses to fetch.
     */
    where?: UserStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserStatuses to fetch.
     */
    orderBy?: UserStatusOrderByWithRelationInput | UserStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserStatuses.
     */
    cursor?: UserStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserStatuses.
     */
    skip?: number
    distinct?: UserStatusScalarFieldEnum | UserStatusScalarFieldEnum[]
  }

  /**
   * UserStatus create
   */
  export type UserStatusCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStatus
     */
    select?: UserStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStatus
     */
    omit?: UserStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatusInclude<ExtArgs> | null
    /**
     * The data needed to create a UserStatus.
     */
    data: XOR<UserStatusCreateInput, UserStatusUncheckedCreateInput>
  }

  /**
   * UserStatus createMany
   */
  export type UserStatusCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserStatuses.
     */
    data: UserStatusCreateManyInput | UserStatusCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserStatus createManyAndReturn
   */
  export type UserStatusCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStatus
     */
    select?: UserStatusSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserStatus
     */
    omit?: UserStatusOmit<ExtArgs> | null
    /**
     * The data used to create many UserStatuses.
     */
    data: UserStatusCreateManyInput | UserStatusCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatusIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserStatus update
   */
  export type UserStatusUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStatus
     */
    select?: UserStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStatus
     */
    omit?: UserStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatusInclude<ExtArgs> | null
    /**
     * The data needed to update a UserStatus.
     */
    data: XOR<UserStatusUpdateInput, UserStatusUncheckedUpdateInput>
    /**
     * Choose, which UserStatus to update.
     */
    where: UserStatusWhereUniqueInput
  }

  /**
   * UserStatus updateMany
   */
  export type UserStatusUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserStatuses.
     */
    data: XOR<UserStatusUpdateManyMutationInput, UserStatusUncheckedUpdateManyInput>
    /**
     * Filter which UserStatuses to update
     */
    where?: UserStatusWhereInput
    /**
     * Limit how many UserStatuses to update.
     */
    limit?: number
  }

  /**
   * UserStatus updateManyAndReturn
   */
  export type UserStatusUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStatus
     */
    select?: UserStatusSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserStatus
     */
    omit?: UserStatusOmit<ExtArgs> | null
    /**
     * The data used to update UserStatuses.
     */
    data: XOR<UserStatusUpdateManyMutationInput, UserStatusUncheckedUpdateManyInput>
    /**
     * Filter which UserStatuses to update
     */
    where?: UserStatusWhereInput
    /**
     * Limit how many UserStatuses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatusIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserStatus upsert
   */
  export type UserStatusUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStatus
     */
    select?: UserStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStatus
     */
    omit?: UserStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatusInclude<ExtArgs> | null
    /**
     * The filter to search for the UserStatus to update in case it exists.
     */
    where: UserStatusWhereUniqueInput
    /**
     * In case the UserStatus found by the `where` argument doesn't exist, create a new UserStatus with this data.
     */
    create: XOR<UserStatusCreateInput, UserStatusUncheckedCreateInput>
    /**
     * In case the UserStatus was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserStatusUpdateInput, UserStatusUncheckedUpdateInput>
  }

  /**
   * UserStatus delete
   */
  export type UserStatusDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStatus
     */
    select?: UserStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStatus
     */
    omit?: UserStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatusInclude<ExtArgs> | null
    /**
     * Filter which UserStatus to delete.
     */
    where: UserStatusWhereUniqueInput
  }

  /**
   * UserStatus deleteMany
   */
  export type UserStatusDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserStatuses to delete
     */
    where?: UserStatusWhereInput
    /**
     * Limit how many UserStatuses to delete.
     */
    limit?: number
  }

  /**
   * UserStatus without action
   */
  export type UserStatusDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStatus
     */
    select?: UserStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStatus
     */
    omit?: UserStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatusInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    firebaseUid: 'firebaseUid',
    email: 'email',
    fullName: 'fullName',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    goalPerDay: 'goalPerDay',
    mentorId: 'mentorId',
    deletedAt: 'deletedAt',
    verifiedByAdmin: 'verifiedByAdmin'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ApiKeyScalarFieldEnum: {
    id: 'id',
    key: 'key',
    name: 'name',
    userId: 'userId',
    createdAt: 'createdAt',
    lastUsedAt: 'lastUsedAt',
    isActive: 'isActive',
    deletedAt: 'deletedAt'
  };

  export type ApiKeyScalarFieldEnum = (typeof ApiKeyScalarFieldEnum)[keyof typeof ApiKeyScalarFieldEnum]


  export const AppliedJobScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    company: 'company',
    location: 'location',
    url: 'url',
    appliedDate: 'appliedDate',
    appliedText: 'appliedText',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    type: 'type',
    deletedAt: 'deletedAt'
  };

  export type AppliedJobScalarFieldEnum = (typeof AppliedJobScalarFieldEnum)[keyof typeof AppliedJobScalarFieldEnum]


  export const ProgressScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    weeks: 'weeks',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type ProgressScalarFieldEnum = (typeof ProgressScalarFieldEnum)[keyof typeof ProgressScalarFieldEnum]


  export const AdminMentorScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    name: 'name',
    picture: 'picture',
    expertise: 'expertise',
    background: 'background',
    availability: 'availability',
    isAdmin: 'isAdmin',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    company: 'company',
    role: 'role',
    verifiedByAdmin: 'verifiedByAdmin'
  };

  export type AdminMentorScalarFieldEnum = (typeof AdminMentorScalarFieldEnum)[keyof typeof AdminMentorScalarFieldEnum]


  export const MentorSessionNoteScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    callNumber: 'callNumber',
    notes: 'notes',
    mentorId: 'mentorId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type MentorSessionNoteScalarFieldEnum = (typeof MentorSessionNoteScalarFieldEnum)[keyof typeof MentorSessionNoteScalarFieldEnum]


  export const UserStatusScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    orientation: 'orientation',
    resumeRebuilding: 'resumeRebuilding',
    eligibleForFirstMentorCall: 'eligibleForFirstMentorCall',
    resumeConfirmed: 'resumeConfirmed',
    portfolioBuildingAndConfirmed: 'portfolioBuildingAndConfirmed',
    eligibleForSecondMentorCall: 'eligibleForSecondMentorCall',
    paymentMade: 'paymentMade',
    techDistributionAndExtension: 'techDistributionAndExtension',
    eligibleForThirdMentorCall: 'eligibleForThirdMentorCall',
    cheatSheetBuiltOut: 'cheatSheetBuiltOut',
    hasAppliedEnoughJobs: 'hasAppliedEnoughJobs',
    eligibleForFourthMentorCall: 'eligibleForFourthMentorCall',
    eligibleForFifthMentorCall: 'eligibleForFifthMentorCall',
    fourthMentorCallCompletedAt: 'fourthMentorCallCompletedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    fifthMentorCallCompletedAt: 'fifthMentorCallCompletedAt',
    firstMentorCallCompletedAt: 'firstMentorCallCompletedAt',
    secondMentorCallCompletedAt: 'secondMentorCallCompletedAt',
    thirdMentorCallCompletedAt: 'thirdMentorCallCompletedAt',
    fifthMentorCallGoogleMeetLink: 'fifthMentorCallGoogleMeetLink',
    fifthMentorCallScheduledAt: 'fifthMentorCallScheduledAt',
    finalReview: 'finalReview',
    firstMentorCallGoogleMeetLink: 'firstMentorCallGoogleMeetLink',
    firstMentorCallScheduledAt: 'firstMentorCallScheduledAt',
    fourthMentorCallGoogleMeetLink: 'fourthMentorCallGoogleMeetLink',
    fourthMentorCallScheduledAt: 'fourthMentorCallScheduledAt',
    secondMentorCallGoogleMeetLink: 'secondMentorCallGoogleMeetLink',
    secondMentorCallScheduledAt: 'secondMentorCallScheduledAt',
    thirdMentorCallGoogleMeetLink: 'thirdMentorCallGoogleMeetLink',
    thirdMentorCallScheduledAt: 'thirdMentorCallScheduledAt'
  };

  export type UserStatusScalarFieldEnum = (typeof UserStatusScalarFieldEnum)[keyof typeof UserStatusScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    firebaseUid?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    fullName?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    goalPerDay?: IntFilter<"User"> | number
    mentorId?: StringNullableFilter<"User"> | string | null
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    verifiedByAdmin?: BoolFilter<"User"> | boolean
    apiKeys?: ApiKeyListRelationFilter
    appliedJobs?: AppliedJobListRelationFilter
    Progress?: XOR<ProgressNullableScalarRelationFilter, ProgressWhereInput> | null
    AdminMentor?: XOR<AdminMentorNullableScalarRelationFilter, AdminMentorWhereInput> | null
    UserStatus?: XOR<UserStatusNullableScalarRelationFilter, UserStatusWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    email?: SortOrder
    fullName?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    goalPerDay?: SortOrder
    mentorId?: SortOrderInput | SortOrder
    deletedAt?: SortOrderInput | SortOrder
    verifiedByAdmin?: SortOrder
    apiKeys?: ApiKeyOrderByRelationAggregateInput
    appliedJobs?: AppliedJobOrderByRelationAggregateInput
    Progress?: ProgressOrderByWithRelationInput
    AdminMentor?: AdminMentorOrderByWithRelationInput
    UserStatus?: UserStatusOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    firebaseUid?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    fullName?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    goalPerDay?: IntFilter<"User"> | number
    mentorId?: StringNullableFilter<"User"> | string | null
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    verifiedByAdmin?: BoolFilter<"User"> | boolean
    apiKeys?: ApiKeyListRelationFilter
    appliedJobs?: AppliedJobListRelationFilter
    Progress?: XOR<ProgressNullableScalarRelationFilter, ProgressWhereInput> | null
    AdminMentor?: XOR<AdminMentorNullableScalarRelationFilter, AdminMentorWhereInput> | null
    UserStatus?: XOR<UserStatusNullableScalarRelationFilter, UserStatusWhereInput> | null
  }, "id" | "firebaseUid" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    email?: SortOrder
    fullName?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    goalPerDay?: SortOrder
    mentorId?: SortOrderInput | SortOrder
    deletedAt?: SortOrderInput | SortOrder
    verifiedByAdmin?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    firebaseUid?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    fullName?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    goalPerDay?: IntWithAggregatesFilter<"User"> | number
    mentorId?: StringNullableWithAggregatesFilter<"User"> | string | null
    deletedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    verifiedByAdmin?: BoolWithAggregatesFilter<"User"> | boolean
  }

  export type ApiKeyWhereInput = {
    AND?: ApiKeyWhereInput | ApiKeyWhereInput[]
    OR?: ApiKeyWhereInput[]
    NOT?: ApiKeyWhereInput | ApiKeyWhereInput[]
    id?: StringFilter<"ApiKey"> | string
    key?: StringFilter<"ApiKey"> | string
    name?: StringFilter<"ApiKey"> | string
    userId?: StringFilter<"ApiKey"> | string
    createdAt?: DateTimeFilter<"ApiKey"> | Date | string
    lastUsedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null
    isActive?: BoolFilter<"ApiKey"> | boolean
    deletedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ApiKeyOrderByWithRelationInput = {
    id?: SortOrder
    key?: SortOrder
    name?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    isActive?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ApiKeyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    key?: string
    AND?: ApiKeyWhereInput | ApiKeyWhereInput[]
    OR?: ApiKeyWhereInput[]
    NOT?: ApiKeyWhereInput | ApiKeyWhereInput[]
    name?: StringFilter<"ApiKey"> | string
    userId?: StringFilter<"ApiKey"> | string
    createdAt?: DateTimeFilter<"ApiKey"> | Date | string
    lastUsedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null
    isActive?: BoolFilter<"ApiKey"> | boolean
    deletedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "key">

  export type ApiKeyOrderByWithAggregationInput = {
    id?: SortOrder
    key?: SortOrder
    name?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    isActive?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: ApiKeyCountOrderByAggregateInput
    _max?: ApiKeyMaxOrderByAggregateInput
    _min?: ApiKeyMinOrderByAggregateInput
  }

  export type ApiKeyScalarWhereWithAggregatesInput = {
    AND?: ApiKeyScalarWhereWithAggregatesInput | ApiKeyScalarWhereWithAggregatesInput[]
    OR?: ApiKeyScalarWhereWithAggregatesInput[]
    NOT?: ApiKeyScalarWhereWithAggregatesInput | ApiKeyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ApiKey"> | string
    key?: StringWithAggregatesFilter<"ApiKey"> | string
    name?: StringWithAggregatesFilter<"ApiKey"> | string
    userId?: StringWithAggregatesFilter<"ApiKey"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ApiKey"> | Date | string
    lastUsedAt?: DateTimeNullableWithAggregatesFilter<"ApiKey"> | Date | string | null
    isActive?: BoolWithAggregatesFilter<"ApiKey"> | boolean
    deletedAt?: DateTimeNullableWithAggregatesFilter<"ApiKey"> | Date | string | null
  }

  export type AppliedJobWhereInput = {
    AND?: AppliedJobWhereInput | AppliedJobWhereInput[]
    OR?: AppliedJobWhereInput[]
    NOT?: AppliedJobWhereInput | AppliedJobWhereInput[]
    id?: StringFilter<"AppliedJob"> | string
    userId?: StringFilter<"AppliedJob"> | string
    title?: StringFilter<"AppliedJob"> | string
    company?: StringNullableFilter<"AppliedJob"> | string | null
    location?: StringNullableFilter<"AppliedJob"> | string | null
    url?: StringFilter<"AppliedJob"> | string
    appliedDate?: DateTimeFilter<"AppliedJob"> | Date | string
    appliedText?: StringNullableFilter<"AppliedJob"> | string | null
    status?: StringFilter<"AppliedJob"> | string
    createdAt?: DateTimeFilter<"AppliedJob"> | Date | string
    updatedAt?: DateTimeFilter<"AppliedJob"> | Date | string
    type?: StringFilter<"AppliedJob"> | string
    deletedAt?: DateTimeNullableFilter<"AppliedJob"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AppliedJobOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    company?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    url?: SortOrder
    appliedDate?: SortOrder
    appliedText?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    type?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AppliedJobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AppliedJobWhereInput | AppliedJobWhereInput[]
    OR?: AppliedJobWhereInput[]
    NOT?: AppliedJobWhereInput | AppliedJobWhereInput[]
    userId?: StringFilter<"AppliedJob"> | string
    title?: StringFilter<"AppliedJob"> | string
    company?: StringNullableFilter<"AppliedJob"> | string | null
    location?: StringNullableFilter<"AppliedJob"> | string | null
    url?: StringFilter<"AppliedJob"> | string
    appliedDate?: DateTimeFilter<"AppliedJob"> | Date | string
    appliedText?: StringNullableFilter<"AppliedJob"> | string | null
    status?: StringFilter<"AppliedJob"> | string
    createdAt?: DateTimeFilter<"AppliedJob"> | Date | string
    updatedAt?: DateTimeFilter<"AppliedJob"> | Date | string
    type?: StringFilter<"AppliedJob"> | string
    deletedAt?: DateTimeNullableFilter<"AppliedJob"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type AppliedJobOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    company?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    url?: SortOrder
    appliedDate?: SortOrder
    appliedText?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    type?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: AppliedJobCountOrderByAggregateInput
    _max?: AppliedJobMaxOrderByAggregateInput
    _min?: AppliedJobMinOrderByAggregateInput
  }

  export type AppliedJobScalarWhereWithAggregatesInput = {
    AND?: AppliedJobScalarWhereWithAggregatesInput | AppliedJobScalarWhereWithAggregatesInput[]
    OR?: AppliedJobScalarWhereWithAggregatesInput[]
    NOT?: AppliedJobScalarWhereWithAggregatesInput | AppliedJobScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AppliedJob"> | string
    userId?: StringWithAggregatesFilter<"AppliedJob"> | string
    title?: StringWithAggregatesFilter<"AppliedJob"> | string
    company?: StringNullableWithAggregatesFilter<"AppliedJob"> | string | null
    location?: StringNullableWithAggregatesFilter<"AppliedJob"> | string | null
    url?: StringWithAggregatesFilter<"AppliedJob"> | string
    appliedDate?: DateTimeWithAggregatesFilter<"AppliedJob"> | Date | string
    appliedText?: StringNullableWithAggregatesFilter<"AppliedJob"> | string | null
    status?: StringWithAggregatesFilter<"AppliedJob"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AppliedJob"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AppliedJob"> | Date | string
    type?: StringWithAggregatesFilter<"AppliedJob"> | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"AppliedJob"> | Date | string | null
  }

  export type ProgressWhereInput = {
    AND?: ProgressWhereInput | ProgressWhereInput[]
    OR?: ProgressWhereInput[]
    NOT?: ProgressWhereInput | ProgressWhereInput[]
    id?: StringFilter<"Progress"> | string
    userId?: StringFilter<"Progress"> | string
    weeks?: JsonFilter<"Progress">
    createdAt?: DateTimeFilter<"Progress"> | Date | string
    updatedAt?: DateTimeFilter<"Progress"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Progress"> | Date | string | null
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ProgressOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    weeks?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    User?: UserOrderByWithRelationInput
  }

  export type ProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: ProgressWhereInput | ProgressWhereInput[]
    OR?: ProgressWhereInput[]
    NOT?: ProgressWhereInput | ProgressWhereInput[]
    weeks?: JsonFilter<"Progress">
    createdAt?: DateTimeFilter<"Progress"> | Date | string
    updatedAt?: DateTimeFilter<"Progress"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Progress"> | Date | string | null
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type ProgressOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    weeks?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: ProgressCountOrderByAggregateInput
    _max?: ProgressMaxOrderByAggregateInput
    _min?: ProgressMinOrderByAggregateInput
  }

  export type ProgressScalarWhereWithAggregatesInput = {
    AND?: ProgressScalarWhereWithAggregatesInput | ProgressScalarWhereWithAggregatesInput[]
    OR?: ProgressScalarWhereWithAggregatesInput[]
    NOT?: ProgressScalarWhereWithAggregatesInput | ProgressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Progress"> | string
    userId?: StringWithAggregatesFilter<"Progress"> | string
    weeks?: JsonWithAggregatesFilter<"Progress">
    createdAt?: DateTimeWithAggregatesFilter<"Progress"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Progress"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Progress"> | Date | string | null
  }

  export type AdminMentorWhereInput = {
    AND?: AdminMentorWhereInput | AdminMentorWhereInput[]
    OR?: AdminMentorWhereInput[]
    NOT?: AdminMentorWhereInput | AdminMentorWhereInput[]
    id?: StringFilter<"AdminMentor"> | string
    email?: StringFilter<"AdminMentor"> | string
    password?: StringFilter<"AdminMentor"> | string
    name?: StringFilter<"AdminMentor"> | string
    picture?: StringNullableFilter<"AdminMentor"> | string | null
    expertise?: StringNullableFilter<"AdminMentor"> | string | null
    background?: StringNullableFilter<"AdminMentor"> | string | null
    availability?: StringNullableFilter<"AdminMentor"> | string | null
    isAdmin?: BoolFilter<"AdminMentor"> | boolean
    createdAt?: DateTimeFilter<"AdminMentor"> | Date | string
    updatedAt?: DateTimeFilter<"AdminMentor"> | Date | string
    deletedAt?: DateTimeNullableFilter<"AdminMentor"> | Date | string | null
    company?: StringNullableFilter<"AdminMentor"> | string | null
    role?: StringNullableFilter<"AdminMentor"> | string | null
    verifiedByAdmin?: BoolFilter<"AdminMentor"> | boolean
    User?: UserListRelationFilter
  }

  export type AdminMentorOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    picture?: SortOrderInput | SortOrder
    expertise?: SortOrderInput | SortOrder
    background?: SortOrderInput | SortOrder
    availability?: SortOrderInput | SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    company?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    verifiedByAdmin?: SortOrder
    User?: UserOrderByRelationAggregateInput
  }

  export type AdminMentorWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: AdminMentorWhereInput | AdminMentorWhereInput[]
    OR?: AdminMentorWhereInput[]
    NOT?: AdminMentorWhereInput | AdminMentorWhereInput[]
    password?: StringFilter<"AdminMentor"> | string
    name?: StringFilter<"AdminMentor"> | string
    picture?: StringNullableFilter<"AdminMentor"> | string | null
    expertise?: StringNullableFilter<"AdminMentor"> | string | null
    background?: StringNullableFilter<"AdminMentor"> | string | null
    availability?: StringNullableFilter<"AdminMentor"> | string | null
    isAdmin?: BoolFilter<"AdminMentor"> | boolean
    createdAt?: DateTimeFilter<"AdminMentor"> | Date | string
    updatedAt?: DateTimeFilter<"AdminMentor"> | Date | string
    deletedAt?: DateTimeNullableFilter<"AdminMentor"> | Date | string | null
    company?: StringNullableFilter<"AdminMentor"> | string | null
    role?: StringNullableFilter<"AdminMentor"> | string | null
    verifiedByAdmin?: BoolFilter<"AdminMentor"> | boolean
    User?: UserListRelationFilter
  }, "id" | "email">

  export type AdminMentorOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    picture?: SortOrderInput | SortOrder
    expertise?: SortOrderInput | SortOrder
    background?: SortOrderInput | SortOrder
    availability?: SortOrderInput | SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    company?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    verifiedByAdmin?: SortOrder
    _count?: AdminMentorCountOrderByAggregateInput
    _max?: AdminMentorMaxOrderByAggregateInput
    _min?: AdminMentorMinOrderByAggregateInput
  }

  export type AdminMentorScalarWhereWithAggregatesInput = {
    AND?: AdminMentorScalarWhereWithAggregatesInput | AdminMentorScalarWhereWithAggregatesInput[]
    OR?: AdminMentorScalarWhereWithAggregatesInput[]
    NOT?: AdminMentorScalarWhereWithAggregatesInput | AdminMentorScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AdminMentor"> | string
    email?: StringWithAggregatesFilter<"AdminMentor"> | string
    password?: StringWithAggregatesFilter<"AdminMentor"> | string
    name?: StringWithAggregatesFilter<"AdminMentor"> | string
    picture?: StringNullableWithAggregatesFilter<"AdminMentor"> | string | null
    expertise?: StringNullableWithAggregatesFilter<"AdminMentor"> | string | null
    background?: StringNullableWithAggregatesFilter<"AdminMentor"> | string | null
    availability?: StringNullableWithAggregatesFilter<"AdminMentor"> | string | null
    isAdmin?: BoolWithAggregatesFilter<"AdminMentor"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"AdminMentor"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AdminMentor"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"AdminMentor"> | Date | string | null
    company?: StringNullableWithAggregatesFilter<"AdminMentor"> | string | null
    role?: StringNullableWithAggregatesFilter<"AdminMentor"> | string | null
    verifiedByAdmin?: BoolWithAggregatesFilter<"AdminMentor"> | boolean
  }

  export type MentorSessionNoteWhereInput = {
    AND?: MentorSessionNoteWhereInput | MentorSessionNoteWhereInput[]
    OR?: MentorSessionNoteWhereInput[]
    NOT?: MentorSessionNoteWhereInput | MentorSessionNoteWhereInput[]
    id?: StringFilter<"MentorSessionNote"> | string
    userId?: StringFilter<"MentorSessionNote"> | string
    callNumber?: IntFilter<"MentorSessionNote"> | number
    notes?: StringFilter<"MentorSessionNote"> | string
    mentorId?: StringNullableFilter<"MentorSessionNote"> | string | null
    createdAt?: DateTimeFilter<"MentorSessionNote"> | Date | string
    updatedAt?: DateTimeFilter<"MentorSessionNote"> | Date | string
    deletedAt?: DateTimeNullableFilter<"MentorSessionNote"> | Date | string | null
  }

  export type MentorSessionNoteOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    callNumber?: SortOrder
    notes?: SortOrder
    mentorId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
  }

  export type MentorSessionNoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_callNumber?: MentorSessionNoteUserIdCallNumberCompoundUniqueInput
    AND?: MentorSessionNoteWhereInput | MentorSessionNoteWhereInput[]
    OR?: MentorSessionNoteWhereInput[]
    NOT?: MentorSessionNoteWhereInput | MentorSessionNoteWhereInput[]
    userId?: StringFilter<"MentorSessionNote"> | string
    callNumber?: IntFilter<"MentorSessionNote"> | number
    notes?: StringFilter<"MentorSessionNote"> | string
    mentorId?: StringNullableFilter<"MentorSessionNote"> | string | null
    createdAt?: DateTimeFilter<"MentorSessionNote"> | Date | string
    updatedAt?: DateTimeFilter<"MentorSessionNote"> | Date | string
    deletedAt?: DateTimeNullableFilter<"MentorSessionNote"> | Date | string | null
  }, "id" | "userId_callNumber">

  export type MentorSessionNoteOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    callNumber?: SortOrder
    notes?: SortOrder
    mentorId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: MentorSessionNoteCountOrderByAggregateInput
    _avg?: MentorSessionNoteAvgOrderByAggregateInput
    _max?: MentorSessionNoteMaxOrderByAggregateInput
    _min?: MentorSessionNoteMinOrderByAggregateInput
    _sum?: MentorSessionNoteSumOrderByAggregateInput
  }

  export type MentorSessionNoteScalarWhereWithAggregatesInput = {
    AND?: MentorSessionNoteScalarWhereWithAggregatesInput | MentorSessionNoteScalarWhereWithAggregatesInput[]
    OR?: MentorSessionNoteScalarWhereWithAggregatesInput[]
    NOT?: MentorSessionNoteScalarWhereWithAggregatesInput | MentorSessionNoteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MentorSessionNote"> | string
    userId?: StringWithAggregatesFilter<"MentorSessionNote"> | string
    callNumber?: IntWithAggregatesFilter<"MentorSessionNote"> | number
    notes?: StringWithAggregatesFilter<"MentorSessionNote"> | string
    mentorId?: StringNullableWithAggregatesFilter<"MentorSessionNote"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"MentorSessionNote"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MentorSessionNote"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"MentorSessionNote"> | Date | string | null
  }

  export type UserStatusWhereInput = {
    AND?: UserStatusWhereInput | UserStatusWhereInput[]
    OR?: UserStatusWhereInput[]
    NOT?: UserStatusWhereInput | UserStatusWhereInput[]
    id?: StringFilter<"UserStatus"> | string
    userId?: StringFilter<"UserStatus"> | string
    orientation?: BoolFilter<"UserStatus"> | boolean
    resumeRebuilding?: BoolFilter<"UserStatus"> | boolean
    eligibleForFirstMentorCall?: BoolFilter<"UserStatus"> | boolean
    resumeConfirmed?: BoolFilter<"UserStatus"> | boolean
    portfolioBuildingAndConfirmed?: BoolFilter<"UserStatus"> | boolean
    eligibleForSecondMentorCall?: BoolFilter<"UserStatus"> | boolean
    paymentMade?: BoolFilter<"UserStatus"> | boolean
    techDistributionAndExtension?: BoolFilter<"UserStatus"> | boolean
    eligibleForThirdMentorCall?: BoolFilter<"UserStatus"> | boolean
    cheatSheetBuiltOut?: BoolFilter<"UserStatus"> | boolean
    hasAppliedEnoughJobs?: BoolFilter<"UserStatus"> | boolean
    eligibleForFourthMentorCall?: BoolFilter<"UserStatus"> | boolean
    eligibleForFifthMentorCall?: BoolFilter<"UserStatus"> | boolean
    fourthMentorCallCompletedAt?: DateTimeNullableFilter<"UserStatus"> | Date | string | null
    createdAt?: DateTimeFilter<"UserStatus"> | Date | string
    updatedAt?: DateTimeFilter<"UserStatus"> | Date | string
    deletedAt?: DateTimeNullableFilter<"UserStatus"> | Date | string | null
    fifthMentorCallCompletedAt?: DateTimeNullableFilter<"UserStatus"> | Date | string | null
    firstMentorCallCompletedAt?: DateTimeNullableFilter<"UserStatus"> | Date | string | null
    secondMentorCallCompletedAt?: DateTimeNullableFilter<"UserStatus"> | Date | string | null
    thirdMentorCallCompletedAt?: DateTimeNullableFilter<"UserStatus"> | Date | string | null
    fifthMentorCallGoogleMeetLink?: StringNullableFilter<"UserStatus"> | string | null
    fifthMentorCallScheduledAt?: DateTimeNullableFilter<"UserStatus"> | Date | string | null
    finalReview?: BoolFilter<"UserStatus"> | boolean
    firstMentorCallGoogleMeetLink?: StringNullableFilter<"UserStatus"> | string | null
    firstMentorCallScheduledAt?: DateTimeNullableFilter<"UserStatus"> | Date | string | null
    fourthMentorCallGoogleMeetLink?: StringNullableFilter<"UserStatus"> | string | null
    fourthMentorCallScheduledAt?: DateTimeNullableFilter<"UserStatus"> | Date | string | null
    secondMentorCallGoogleMeetLink?: StringNullableFilter<"UserStatus"> | string | null
    secondMentorCallScheduledAt?: DateTimeNullableFilter<"UserStatus"> | Date | string | null
    thirdMentorCallGoogleMeetLink?: StringNullableFilter<"UserStatus"> | string | null
    thirdMentorCallScheduledAt?: DateTimeNullableFilter<"UserStatus"> | Date | string | null
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UserStatusOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    orientation?: SortOrder
    resumeRebuilding?: SortOrder
    eligibleForFirstMentorCall?: SortOrder
    resumeConfirmed?: SortOrder
    portfolioBuildingAndConfirmed?: SortOrder
    eligibleForSecondMentorCall?: SortOrder
    paymentMade?: SortOrder
    techDistributionAndExtension?: SortOrder
    eligibleForThirdMentorCall?: SortOrder
    cheatSheetBuiltOut?: SortOrder
    hasAppliedEnoughJobs?: SortOrder
    eligibleForFourthMentorCall?: SortOrder
    eligibleForFifthMentorCall?: SortOrder
    fourthMentorCallCompletedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    fifthMentorCallCompletedAt?: SortOrderInput | SortOrder
    firstMentorCallCompletedAt?: SortOrderInput | SortOrder
    secondMentorCallCompletedAt?: SortOrderInput | SortOrder
    thirdMentorCallCompletedAt?: SortOrderInput | SortOrder
    fifthMentorCallGoogleMeetLink?: SortOrderInput | SortOrder
    fifthMentorCallScheduledAt?: SortOrderInput | SortOrder
    finalReview?: SortOrder
    firstMentorCallGoogleMeetLink?: SortOrderInput | SortOrder
    firstMentorCallScheduledAt?: SortOrderInput | SortOrder
    fourthMentorCallGoogleMeetLink?: SortOrderInput | SortOrder
    fourthMentorCallScheduledAt?: SortOrderInput | SortOrder
    secondMentorCallGoogleMeetLink?: SortOrderInput | SortOrder
    secondMentorCallScheduledAt?: SortOrderInput | SortOrder
    thirdMentorCallGoogleMeetLink?: SortOrderInput | SortOrder
    thirdMentorCallScheduledAt?: SortOrderInput | SortOrder
    User?: UserOrderByWithRelationInput
  }

  export type UserStatusWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: UserStatusWhereInput | UserStatusWhereInput[]
    OR?: UserStatusWhereInput[]
    NOT?: UserStatusWhereInput | UserStatusWhereInput[]
    orientation?: BoolFilter<"UserStatus"> | boolean
    resumeRebuilding?: BoolFilter<"UserStatus"> | boolean
    eligibleForFirstMentorCall?: BoolFilter<"UserStatus"> | boolean
    resumeConfirmed?: BoolFilter<"UserStatus"> | boolean
    portfolioBuildingAndConfirmed?: BoolFilter<"UserStatus"> | boolean
    eligibleForSecondMentorCall?: BoolFilter<"UserStatus"> | boolean
    paymentMade?: BoolFilter<"UserStatus"> | boolean
    techDistributionAndExtension?: BoolFilter<"UserStatus"> | boolean
    eligibleForThirdMentorCall?: BoolFilter<"UserStatus"> | boolean
    cheatSheetBuiltOut?: BoolFilter<"UserStatus"> | boolean
    hasAppliedEnoughJobs?: BoolFilter<"UserStatus"> | boolean
    eligibleForFourthMentorCall?: BoolFilter<"UserStatus"> | boolean
    eligibleForFifthMentorCall?: BoolFilter<"UserStatus"> | boolean
    fourthMentorCallCompletedAt?: DateTimeNullableFilter<"UserStatus"> | Date | string | null
    createdAt?: DateTimeFilter<"UserStatus"> | Date | string
    updatedAt?: DateTimeFilter<"UserStatus"> | Date | string
    deletedAt?: DateTimeNullableFilter<"UserStatus"> | Date | string | null
    fifthMentorCallCompletedAt?: DateTimeNullableFilter<"UserStatus"> | Date | string | null
    firstMentorCallCompletedAt?: DateTimeNullableFilter<"UserStatus"> | Date | string | null
    secondMentorCallCompletedAt?: DateTimeNullableFilter<"UserStatus"> | Date | string | null
    thirdMentorCallCompletedAt?: DateTimeNullableFilter<"UserStatus"> | Date | string | null
    fifthMentorCallGoogleMeetLink?: StringNullableFilter<"UserStatus"> | string | null
    fifthMentorCallScheduledAt?: DateTimeNullableFilter<"UserStatus"> | Date | string | null
    finalReview?: BoolFilter<"UserStatus"> | boolean
    firstMentorCallGoogleMeetLink?: StringNullableFilter<"UserStatus"> | string | null
    firstMentorCallScheduledAt?: DateTimeNullableFilter<"UserStatus"> | Date | string | null
    fourthMentorCallGoogleMeetLink?: StringNullableFilter<"UserStatus"> | string | null
    fourthMentorCallScheduledAt?: DateTimeNullableFilter<"UserStatus"> | Date | string | null
    secondMentorCallGoogleMeetLink?: StringNullableFilter<"UserStatus"> | string | null
    secondMentorCallScheduledAt?: DateTimeNullableFilter<"UserStatus"> | Date | string | null
    thirdMentorCallGoogleMeetLink?: StringNullableFilter<"UserStatus"> | string | null
    thirdMentorCallScheduledAt?: DateTimeNullableFilter<"UserStatus"> | Date | string | null
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type UserStatusOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    orientation?: SortOrder
    resumeRebuilding?: SortOrder
    eligibleForFirstMentorCall?: SortOrder
    resumeConfirmed?: SortOrder
    portfolioBuildingAndConfirmed?: SortOrder
    eligibleForSecondMentorCall?: SortOrder
    paymentMade?: SortOrder
    techDistributionAndExtension?: SortOrder
    eligibleForThirdMentorCall?: SortOrder
    cheatSheetBuiltOut?: SortOrder
    hasAppliedEnoughJobs?: SortOrder
    eligibleForFourthMentorCall?: SortOrder
    eligibleForFifthMentorCall?: SortOrder
    fourthMentorCallCompletedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    fifthMentorCallCompletedAt?: SortOrderInput | SortOrder
    firstMentorCallCompletedAt?: SortOrderInput | SortOrder
    secondMentorCallCompletedAt?: SortOrderInput | SortOrder
    thirdMentorCallCompletedAt?: SortOrderInput | SortOrder
    fifthMentorCallGoogleMeetLink?: SortOrderInput | SortOrder
    fifthMentorCallScheduledAt?: SortOrderInput | SortOrder
    finalReview?: SortOrder
    firstMentorCallGoogleMeetLink?: SortOrderInput | SortOrder
    firstMentorCallScheduledAt?: SortOrderInput | SortOrder
    fourthMentorCallGoogleMeetLink?: SortOrderInput | SortOrder
    fourthMentorCallScheduledAt?: SortOrderInput | SortOrder
    secondMentorCallGoogleMeetLink?: SortOrderInput | SortOrder
    secondMentorCallScheduledAt?: SortOrderInput | SortOrder
    thirdMentorCallGoogleMeetLink?: SortOrderInput | SortOrder
    thirdMentorCallScheduledAt?: SortOrderInput | SortOrder
    _count?: UserStatusCountOrderByAggregateInput
    _max?: UserStatusMaxOrderByAggregateInput
    _min?: UserStatusMinOrderByAggregateInput
  }

  export type UserStatusScalarWhereWithAggregatesInput = {
    AND?: UserStatusScalarWhereWithAggregatesInput | UserStatusScalarWhereWithAggregatesInput[]
    OR?: UserStatusScalarWhereWithAggregatesInput[]
    NOT?: UserStatusScalarWhereWithAggregatesInput | UserStatusScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserStatus"> | string
    userId?: StringWithAggregatesFilter<"UserStatus"> | string
    orientation?: BoolWithAggregatesFilter<"UserStatus"> | boolean
    resumeRebuilding?: BoolWithAggregatesFilter<"UserStatus"> | boolean
    eligibleForFirstMentorCall?: BoolWithAggregatesFilter<"UserStatus"> | boolean
    resumeConfirmed?: BoolWithAggregatesFilter<"UserStatus"> | boolean
    portfolioBuildingAndConfirmed?: BoolWithAggregatesFilter<"UserStatus"> | boolean
    eligibleForSecondMentorCall?: BoolWithAggregatesFilter<"UserStatus"> | boolean
    paymentMade?: BoolWithAggregatesFilter<"UserStatus"> | boolean
    techDistributionAndExtension?: BoolWithAggregatesFilter<"UserStatus"> | boolean
    eligibleForThirdMentorCall?: BoolWithAggregatesFilter<"UserStatus"> | boolean
    cheatSheetBuiltOut?: BoolWithAggregatesFilter<"UserStatus"> | boolean
    hasAppliedEnoughJobs?: BoolWithAggregatesFilter<"UserStatus"> | boolean
    eligibleForFourthMentorCall?: BoolWithAggregatesFilter<"UserStatus"> | boolean
    eligibleForFifthMentorCall?: BoolWithAggregatesFilter<"UserStatus"> | boolean
    fourthMentorCallCompletedAt?: DateTimeNullableWithAggregatesFilter<"UserStatus"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"UserStatus"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserStatus"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"UserStatus"> | Date | string | null
    fifthMentorCallCompletedAt?: DateTimeNullableWithAggregatesFilter<"UserStatus"> | Date | string | null
    firstMentorCallCompletedAt?: DateTimeNullableWithAggregatesFilter<"UserStatus"> | Date | string | null
    secondMentorCallCompletedAt?: DateTimeNullableWithAggregatesFilter<"UserStatus"> | Date | string | null
    thirdMentorCallCompletedAt?: DateTimeNullableWithAggregatesFilter<"UserStatus"> | Date | string | null
    fifthMentorCallGoogleMeetLink?: StringNullableWithAggregatesFilter<"UserStatus"> | string | null
    fifthMentorCallScheduledAt?: DateTimeNullableWithAggregatesFilter<"UserStatus"> | Date | string | null
    finalReview?: BoolWithAggregatesFilter<"UserStatus"> | boolean
    firstMentorCallGoogleMeetLink?: StringNullableWithAggregatesFilter<"UserStatus"> | string | null
    firstMentorCallScheduledAt?: DateTimeNullableWithAggregatesFilter<"UserStatus"> | Date | string | null
    fourthMentorCallGoogleMeetLink?: StringNullableWithAggregatesFilter<"UserStatus"> | string | null
    fourthMentorCallScheduledAt?: DateTimeNullableWithAggregatesFilter<"UserStatus"> | Date | string | null
    secondMentorCallGoogleMeetLink?: StringNullableWithAggregatesFilter<"UserStatus"> | string | null
    secondMentorCallScheduledAt?: DateTimeNullableWithAggregatesFilter<"UserStatus"> | Date | string | null
    thirdMentorCallGoogleMeetLink?: StringNullableWithAggregatesFilter<"UserStatus"> | string | null
    thirdMentorCallScheduledAt?: DateTimeNullableWithAggregatesFilter<"UserStatus"> | Date | string | null
  }

  export type UserCreateInput = {
    id?: string
    firebaseUid: string
    email: string
    fullName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    goalPerDay?: number
    deletedAt?: Date | string | null
    verifiedByAdmin?: boolean
    apiKeys?: ApiKeyCreateNestedManyWithoutUserInput
    appliedJobs?: AppliedJobCreateNestedManyWithoutUserInput
    Progress?: ProgressCreateNestedOneWithoutUserInput
    AdminMentor?: AdminMentorCreateNestedOneWithoutUserInput
    UserStatus?: UserStatusCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    firebaseUid: string
    email: string
    fullName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    goalPerDay?: number
    mentorId?: string | null
    deletedAt?: Date | string | null
    verifiedByAdmin?: boolean
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutUserInput
    appliedJobs?: AppliedJobUncheckedCreateNestedManyWithoutUserInput
    Progress?: ProgressUncheckedCreateNestedOneWithoutUserInput
    UserStatus?: UserStatusUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    goalPerDay?: IntFieldUpdateOperationsInput | number
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedByAdmin?: BoolFieldUpdateOperationsInput | boolean
    apiKeys?: ApiKeyUpdateManyWithoutUserNestedInput
    appliedJobs?: AppliedJobUpdateManyWithoutUserNestedInput
    Progress?: ProgressUpdateOneWithoutUserNestedInput
    AdminMentor?: AdminMentorUpdateOneWithoutUserNestedInput
    UserStatus?: UserStatusUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    goalPerDay?: IntFieldUpdateOperationsInput | number
    mentorId?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedByAdmin?: BoolFieldUpdateOperationsInput | boolean
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutUserNestedInput
    appliedJobs?: AppliedJobUncheckedUpdateManyWithoutUserNestedInput
    Progress?: ProgressUncheckedUpdateOneWithoutUserNestedInput
    UserStatus?: UserStatusUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    firebaseUid: string
    email: string
    fullName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    goalPerDay?: number
    mentorId?: string | null
    deletedAt?: Date | string | null
    verifiedByAdmin?: boolean
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    goalPerDay?: IntFieldUpdateOperationsInput | number
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedByAdmin?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    goalPerDay?: IntFieldUpdateOperationsInput | number
    mentorId?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedByAdmin?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ApiKeyCreateInput = {
    id?: string
    key: string
    name: string
    createdAt?: Date | string
    lastUsedAt?: Date | string | null
    isActive?: boolean
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutApiKeysInput
  }

  export type ApiKeyUncheckedCreateInput = {
    id?: string
    key: string
    name: string
    userId: string
    createdAt?: Date | string
    lastUsedAt?: Date | string | null
    isActive?: boolean
    deletedAt?: Date | string | null
  }

  export type ApiKeyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutApiKeysNestedInput
  }

  export type ApiKeyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ApiKeyCreateManyInput = {
    id?: string
    key: string
    name: string
    userId: string
    createdAt?: Date | string
    lastUsedAt?: Date | string | null
    isActive?: boolean
    deletedAt?: Date | string | null
  }

  export type ApiKeyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ApiKeyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AppliedJobCreateInput = {
    id?: string
    title: string
    company?: string | null
    location?: string | null
    url: string
    appliedDate?: Date | string
    appliedText?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    type?: string
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutAppliedJobsInput
  }

  export type AppliedJobUncheckedCreateInput = {
    id?: string
    userId: string
    title: string
    company?: string | null
    location?: string | null
    url: string
    appliedDate?: Date | string
    appliedText?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    type?: string
    deletedAt?: Date | string | null
  }

  export type AppliedJobUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    appliedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    appliedText?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutAppliedJobsNestedInput
  }

  export type AppliedJobUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    appliedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    appliedText?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AppliedJobCreateManyInput = {
    id?: string
    userId: string
    title: string
    company?: string | null
    location?: string | null
    url: string
    appliedDate?: Date | string
    appliedText?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    type?: string
    deletedAt?: Date | string | null
  }

  export type AppliedJobUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    appliedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    appliedText?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AppliedJobUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    appliedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    appliedText?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProgressCreateInput = {
    id: string
    weeks: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt: Date | string
    deletedAt?: Date | string | null
    User: UserCreateNestedOneWithoutProgressInput
  }

  export type ProgressUncheckedCreateInput = {
    id: string
    userId: string
    weeks: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt: Date | string
    deletedAt?: Date | string | null
  }

  export type ProgressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weeks?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    User?: UserUpdateOneRequiredWithoutProgressNestedInput
  }

  export type ProgressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    weeks?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProgressCreateManyInput = {
    id: string
    userId: string
    weeks: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt: Date | string
    deletedAt?: Date | string | null
  }

  export type ProgressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    weeks?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProgressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    weeks?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AdminMentorCreateInput = {
    id: string
    email: string
    password: string
    name: string
    picture?: string | null
    expertise?: string | null
    background?: string | null
    availability?: string | null
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt: Date | string
    deletedAt?: Date | string | null
    company?: string | null
    role?: string | null
    verifiedByAdmin?: boolean
    User?: UserCreateNestedManyWithoutAdminMentorInput
  }

  export type AdminMentorUncheckedCreateInput = {
    id: string
    email: string
    password: string
    name: string
    picture?: string | null
    expertise?: string | null
    background?: string | null
    availability?: string | null
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt: Date | string
    deletedAt?: Date | string | null
    company?: string | null
    role?: string | null
    verifiedByAdmin?: boolean
    User?: UserUncheckedCreateNestedManyWithoutAdminMentorInput
  }

  export type AdminMentorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    expertise?: NullableStringFieldUpdateOperationsInput | string | null
    background?: NullableStringFieldUpdateOperationsInput | string | null
    availability?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedByAdmin?: BoolFieldUpdateOperationsInput | boolean
    User?: UserUpdateManyWithoutAdminMentorNestedInput
  }

  export type AdminMentorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    expertise?: NullableStringFieldUpdateOperationsInput | string | null
    background?: NullableStringFieldUpdateOperationsInput | string | null
    availability?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedByAdmin?: BoolFieldUpdateOperationsInput | boolean
    User?: UserUncheckedUpdateManyWithoutAdminMentorNestedInput
  }

  export type AdminMentorCreateManyInput = {
    id: string
    email: string
    password: string
    name: string
    picture?: string | null
    expertise?: string | null
    background?: string | null
    availability?: string | null
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt: Date | string
    deletedAt?: Date | string | null
    company?: string | null
    role?: string | null
    verifiedByAdmin?: boolean
  }

  export type AdminMentorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    expertise?: NullableStringFieldUpdateOperationsInput | string | null
    background?: NullableStringFieldUpdateOperationsInput | string | null
    availability?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedByAdmin?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AdminMentorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    expertise?: NullableStringFieldUpdateOperationsInput | string | null
    background?: NullableStringFieldUpdateOperationsInput | string | null
    availability?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedByAdmin?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MentorSessionNoteCreateInput = {
    id: string
    userId: string
    callNumber: number
    notes?: string
    mentorId?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    deletedAt?: Date | string | null
  }

  export type MentorSessionNoteUncheckedCreateInput = {
    id: string
    userId: string
    callNumber: number
    notes?: string
    mentorId?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    deletedAt?: Date | string | null
  }

  export type MentorSessionNoteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    callNumber?: IntFieldUpdateOperationsInput | number
    notes?: StringFieldUpdateOperationsInput | string
    mentorId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MentorSessionNoteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    callNumber?: IntFieldUpdateOperationsInput | number
    notes?: StringFieldUpdateOperationsInput | string
    mentorId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MentorSessionNoteCreateManyInput = {
    id: string
    userId: string
    callNumber: number
    notes?: string
    mentorId?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    deletedAt?: Date | string | null
  }

  export type MentorSessionNoteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    callNumber?: IntFieldUpdateOperationsInput | number
    notes?: StringFieldUpdateOperationsInput | string
    mentorId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MentorSessionNoteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    callNumber?: IntFieldUpdateOperationsInput | number
    notes?: StringFieldUpdateOperationsInput | string
    mentorId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserStatusCreateInput = {
    id: string
    orientation?: boolean
    resumeRebuilding?: boolean
    eligibleForFirstMentorCall?: boolean
    resumeConfirmed?: boolean
    portfolioBuildingAndConfirmed?: boolean
    eligibleForSecondMentorCall?: boolean
    paymentMade?: boolean
    techDistributionAndExtension?: boolean
    eligibleForThirdMentorCall?: boolean
    cheatSheetBuiltOut?: boolean
    hasAppliedEnoughJobs?: boolean
    eligibleForFourthMentorCall?: boolean
    eligibleForFifthMentorCall?: boolean
    fourthMentorCallCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt: Date | string
    deletedAt?: Date | string | null
    fifthMentorCallCompletedAt?: Date | string | null
    firstMentorCallCompletedAt?: Date | string | null
    secondMentorCallCompletedAt?: Date | string | null
    thirdMentorCallCompletedAt?: Date | string | null
    fifthMentorCallGoogleMeetLink?: string | null
    fifthMentorCallScheduledAt?: Date | string | null
    finalReview?: boolean
    firstMentorCallGoogleMeetLink?: string | null
    firstMentorCallScheduledAt?: Date | string | null
    fourthMentorCallGoogleMeetLink?: string | null
    fourthMentorCallScheduledAt?: Date | string | null
    secondMentorCallGoogleMeetLink?: string | null
    secondMentorCallScheduledAt?: Date | string | null
    thirdMentorCallGoogleMeetLink?: string | null
    thirdMentorCallScheduledAt?: Date | string | null
    User: UserCreateNestedOneWithoutUserStatusInput
  }

  export type UserStatusUncheckedCreateInput = {
    id: string
    userId: string
    orientation?: boolean
    resumeRebuilding?: boolean
    eligibleForFirstMentorCall?: boolean
    resumeConfirmed?: boolean
    portfolioBuildingAndConfirmed?: boolean
    eligibleForSecondMentorCall?: boolean
    paymentMade?: boolean
    techDistributionAndExtension?: boolean
    eligibleForThirdMentorCall?: boolean
    cheatSheetBuiltOut?: boolean
    hasAppliedEnoughJobs?: boolean
    eligibleForFourthMentorCall?: boolean
    eligibleForFifthMentorCall?: boolean
    fourthMentorCallCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt: Date | string
    deletedAt?: Date | string | null
    fifthMentorCallCompletedAt?: Date | string | null
    firstMentorCallCompletedAt?: Date | string | null
    secondMentorCallCompletedAt?: Date | string | null
    thirdMentorCallCompletedAt?: Date | string | null
    fifthMentorCallGoogleMeetLink?: string | null
    fifthMentorCallScheduledAt?: Date | string | null
    finalReview?: boolean
    firstMentorCallGoogleMeetLink?: string | null
    firstMentorCallScheduledAt?: Date | string | null
    fourthMentorCallGoogleMeetLink?: string | null
    fourthMentorCallScheduledAt?: Date | string | null
    secondMentorCallGoogleMeetLink?: string | null
    secondMentorCallScheduledAt?: Date | string | null
    thirdMentorCallGoogleMeetLink?: string | null
    thirdMentorCallScheduledAt?: Date | string | null
  }

  export type UserStatusUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orientation?: BoolFieldUpdateOperationsInput | boolean
    resumeRebuilding?: BoolFieldUpdateOperationsInput | boolean
    eligibleForFirstMentorCall?: BoolFieldUpdateOperationsInput | boolean
    resumeConfirmed?: BoolFieldUpdateOperationsInput | boolean
    portfolioBuildingAndConfirmed?: BoolFieldUpdateOperationsInput | boolean
    eligibleForSecondMentorCall?: BoolFieldUpdateOperationsInput | boolean
    paymentMade?: BoolFieldUpdateOperationsInput | boolean
    techDistributionAndExtension?: BoolFieldUpdateOperationsInput | boolean
    eligibleForThirdMentorCall?: BoolFieldUpdateOperationsInput | boolean
    cheatSheetBuiltOut?: BoolFieldUpdateOperationsInput | boolean
    hasAppliedEnoughJobs?: BoolFieldUpdateOperationsInput | boolean
    eligibleForFourthMentorCall?: BoolFieldUpdateOperationsInput | boolean
    eligibleForFifthMentorCall?: BoolFieldUpdateOperationsInput | boolean
    fourthMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fifthMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firstMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    secondMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    thirdMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fifthMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    fifthMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finalReview?: BoolFieldUpdateOperationsInput | boolean
    firstMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    firstMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fourthMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    fourthMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    secondMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    secondMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    thirdMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    thirdMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    User?: UserUpdateOneRequiredWithoutUserStatusNestedInput
  }

  export type UserStatusUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    orientation?: BoolFieldUpdateOperationsInput | boolean
    resumeRebuilding?: BoolFieldUpdateOperationsInput | boolean
    eligibleForFirstMentorCall?: BoolFieldUpdateOperationsInput | boolean
    resumeConfirmed?: BoolFieldUpdateOperationsInput | boolean
    portfolioBuildingAndConfirmed?: BoolFieldUpdateOperationsInput | boolean
    eligibleForSecondMentorCall?: BoolFieldUpdateOperationsInput | boolean
    paymentMade?: BoolFieldUpdateOperationsInput | boolean
    techDistributionAndExtension?: BoolFieldUpdateOperationsInput | boolean
    eligibleForThirdMentorCall?: BoolFieldUpdateOperationsInput | boolean
    cheatSheetBuiltOut?: BoolFieldUpdateOperationsInput | boolean
    hasAppliedEnoughJobs?: BoolFieldUpdateOperationsInput | boolean
    eligibleForFourthMentorCall?: BoolFieldUpdateOperationsInput | boolean
    eligibleForFifthMentorCall?: BoolFieldUpdateOperationsInput | boolean
    fourthMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fifthMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firstMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    secondMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    thirdMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fifthMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    fifthMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finalReview?: BoolFieldUpdateOperationsInput | boolean
    firstMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    firstMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fourthMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    fourthMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    secondMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    secondMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    thirdMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    thirdMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserStatusCreateManyInput = {
    id: string
    userId: string
    orientation?: boolean
    resumeRebuilding?: boolean
    eligibleForFirstMentorCall?: boolean
    resumeConfirmed?: boolean
    portfolioBuildingAndConfirmed?: boolean
    eligibleForSecondMentorCall?: boolean
    paymentMade?: boolean
    techDistributionAndExtension?: boolean
    eligibleForThirdMentorCall?: boolean
    cheatSheetBuiltOut?: boolean
    hasAppliedEnoughJobs?: boolean
    eligibleForFourthMentorCall?: boolean
    eligibleForFifthMentorCall?: boolean
    fourthMentorCallCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt: Date | string
    deletedAt?: Date | string | null
    fifthMentorCallCompletedAt?: Date | string | null
    firstMentorCallCompletedAt?: Date | string | null
    secondMentorCallCompletedAt?: Date | string | null
    thirdMentorCallCompletedAt?: Date | string | null
    fifthMentorCallGoogleMeetLink?: string | null
    fifthMentorCallScheduledAt?: Date | string | null
    finalReview?: boolean
    firstMentorCallGoogleMeetLink?: string | null
    firstMentorCallScheduledAt?: Date | string | null
    fourthMentorCallGoogleMeetLink?: string | null
    fourthMentorCallScheduledAt?: Date | string | null
    secondMentorCallGoogleMeetLink?: string | null
    secondMentorCallScheduledAt?: Date | string | null
    thirdMentorCallGoogleMeetLink?: string | null
    thirdMentorCallScheduledAt?: Date | string | null
  }

  export type UserStatusUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    orientation?: BoolFieldUpdateOperationsInput | boolean
    resumeRebuilding?: BoolFieldUpdateOperationsInput | boolean
    eligibleForFirstMentorCall?: BoolFieldUpdateOperationsInput | boolean
    resumeConfirmed?: BoolFieldUpdateOperationsInput | boolean
    portfolioBuildingAndConfirmed?: BoolFieldUpdateOperationsInput | boolean
    eligibleForSecondMentorCall?: BoolFieldUpdateOperationsInput | boolean
    paymentMade?: BoolFieldUpdateOperationsInput | boolean
    techDistributionAndExtension?: BoolFieldUpdateOperationsInput | boolean
    eligibleForThirdMentorCall?: BoolFieldUpdateOperationsInput | boolean
    cheatSheetBuiltOut?: BoolFieldUpdateOperationsInput | boolean
    hasAppliedEnoughJobs?: BoolFieldUpdateOperationsInput | boolean
    eligibleForFourthMentorCall?: BoolFieldUpdateOperationsInput | boolean
    eligibleForFifthMentorCall?: BoolFieldUpdateOperationsInput | boolean
    fourthMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fifthMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firstMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    secondMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    thirdMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fifthMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    fifthMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finalReview?: BoolFieldUpdateOperationsInput | boolean
    firstMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    firstMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fourthMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    fourthMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    secondMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    secondMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    thirdMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    thirdMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserStatusUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    orientation?: BoolFieldUpdateOperationsInput | boolean
    resumeRebuilding?: BoolFieldUpdateOperationsInput | boolean
    eligibleForFirstMentorCall?: BoolFieldUpdateOperationsInput | boolean
    resumeConfirmed?: BoolFieldUpdateOperationsInput | boolean
    portfolioBuildingAndConfirmed?: BoolFieldUpdateOperationsInput | boolean
    eligibleForSecondMentorCall?: BoolFieldUpdateOperationsInput | boolean
    paymentMade?: BoolFieldUpdateOperationsInput | boolean
    techDistributionAndExtension?: BoolFieldUpdateOperationsInput | boolean
    eligibleForThirdMentorCall?: BoolFieldUpdateOperationsInput | boolean
    cheatSheetBuiltOut?: BoolFieldUpdateOperationsInput | boolean
    hasAppliedEnoughJobs?: BoolFieldUpdateOperationsInput | boolean
    eligibleForFourthMentorCall?: BoolFieldUpdateOperationsInput | boolean
    eligibleForFifthMentorCall?: BoolFieldUpdateOperationsInput | boolean
    fourthMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fifthMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firstMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    secondMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    thirdMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fifthMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    fifthMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finalReview?: BoolFieldUpdateOperationsInput | boolean
    firstMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    firstMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fourthMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    fourthMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    secondMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    secondMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    thirdMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    thirdMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ApiKeyListRelationFilter = {
    every?: ApiKeyWhereInput
    some?: ApiKeyWhereInput
    none?: ApiKeyWhereInput
  }

  export type AppliedJobListRelationFilter = {
    every?: AppliedJobWhereInput
    some?: AppliedJobWhereInput
    none?: AppliedJobWhereInput
  }

  export type ProgressNullableScalarRelationFilter = {
    is?: ProgressWhereInput | null
    isNot?: ProgressWhereInput | null
  }

  export type AdminMentorNullableScalarRelationFilter = {
    is?: AdminMentorWhereInput | null
    isNot?: AdminMentorWhereInput | null
  }

  export type UserStatusNullableScalarRelationFilter = {
    is?: UserStatusWhereInput | null
    isNot?: UserStatusWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ApiKeyOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AppliedJobOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    email?: SortOrder
    fullName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    goalPerDay?: SortOrder
    mentorId?: SortOrder
    deletedAt?: SortOrder
    verifiedByAdmin?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    goalPerDay?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    email?: SortOrder
    fullName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    goalPerDay?: SortOrder
    mentorId?: SortOrder
    deletedAt?: SortOrder
    verifiedByAdmin?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    email?: SortOrder
    fullName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    goalPerDay?: SortOrder
    mentorId?: SortOrder
    deletedAt?: SortOrder
    verifiedByAdmin?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    goalPerDay?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type ApiKeyCountOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    name?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    lastUsedAt?: SortOrder
    isActive?: SortOrder
    deletedAt?: SortOrder
  }

  export type ApiKeyMaxOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    name?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    lastUsedAt?: SortOrder
    isActive?: SortOrder
    deletedAt?: SortOrder
  }

  export type ApiKeyMinOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    name?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    lastUsedAt?: SortOrder
    isActive?: SortOrder
    deletedAt?: SortOrder
  }

  export type AppliedJobCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    company?: SortOrder
    location?: SortOrder
    url?: SortOrder
    appliedDate?: SortOrder
    appliedText?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    type?: SortOrder
    deletedAt?: SortOrder
  }

  export type AppliedJobMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    company?: SortOrder
    location?: SortOrder
    url?: SortOrder
    appliedDate?: SortOrder
    appliedText?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    type?: SortOrder
    deletedAt?: SortOrder
  }

  export type AppliedJobMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    company?: SortOrder
    location?: SortOrder
    url?: SortOrder
    appliedDate?: SortOrder
    appliedText?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    type?: SortOrder
    deletedAt?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ProgressCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    weeks?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type ProgressMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type ProgressMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AdminMentorCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    picture?: SortOrder
    expertise?: SortOrder
    background?: SortOrder
    availability?: SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    company?: SortOrder
    role?: SortOrder
    verifiedByAdmin?: SortOrder
  }

  export type AdminMentorMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    picture?: SortOrder
    expertise?: SortOrder
    background?: SortOrder
    availability?: SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    company?: SortOrder
    role?: SortOrder
    verifiedByAdmin?: SortOrder
  }

  export type AdminMentorMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    picture?: SortOrder
    expertise?: SortOrder
    background?: SortOrder
    availability?: SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    company?: SortOrder
    role?: SortOrder
    verifiedByAdmin?: SortOrder
  }

  export type MentorSessionNoteUserIdCallNumberCompoundUniqueInput = {
    userId: string
    callNumber: number
  }

  export type MentorSessionNoteCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    callNumber?: SortOrder
    notes?: SortOrder
    mentorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type MentorSessionNoteAvgOrderByAggregateInput = {
    callNumber?: SortOrder
  }

  export type MentorSessionNoteMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    callNumber?: SortOrder
    notes?: SortOrder
    mentorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type MentorSessionNoteMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    callNumber?: SortOrder
    notes?: SortOrder
    mentorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type MentorSessionNoteSumOrderByAggregateInput = {
    callNumber?: SortOrder
  }

  export type UserStatusCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    orientation?: SortOrder
    resumeRebuilding?: SortOrder
    eligibleForFirstMentorCall?: SortOrder
    resumeConfirmed?: SortOrder
    portfolioBuildingAndConfirmed?: SortOrder
    eligibleForSecondMentorCall?: SortOrder
    paymentMade?: SortOrder
    techDistributionAndExtension?: SortOrder
    eligibleForThirdMentorCall?: SortOrder
    cheatSheetBuiltOut?: SortOrder
    hasAppliedEnoughJobs?: SortOrder
    eligibleForFourthMentorCall?: SortOrder
    eligibleForFifthMentorCall?: SortOrder
    fourthMentorCallCompletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    fifthMentorCallCompletedAt?: SortOrder
    firstMentorCallCompletedAt?: SortOrder
    secondMentorCallCompletedAt?: SortOrder
    thirdMentorCallCompletedAt?: SortOrder
    fifthMentorCallGoogleMeetLink?: SortOrder
    fifthMentorCallScheduledAt?: SortOrder
    finalReview?: SortOrder
    firstMentorCallGoogleMeetLink?: SortOrder
    firstMentorCallScheduledAt?: SortOrder
    fourthMentorCallGoogleMeetLink?: SortOrder
    fourthMentorCallScheduledAt?: SortOrder
    secondMentorCallGoogleMeetLink?: SortOrder
    secondMentorCallScheduledAt?: SortOrder
    thirdMentorCallGoogleMeetLink?: SortOrder
    thirdMentorCallScheduledAt?: SortOrder
  }

  export type UserStatusMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    orientation?: SortOrder
    resumeRebuilding?: SortOrder
    eligibleForFirstMentorCall?: SortOrder
    resumeConfirmed?: SortOrder
    portfolioBuildingAndConfirmed?: SortOrder
    eligibleForSecondMentorCall?: SortOrder
    paymentMade?: SortOrder
    techDistributionAndExtension?: SortOrder
    eligibleForThirdMentorCall?: SortOrder
    cheatSheetBuiltOut?: SortOrder
    hasAppliedEnoughJobs?: SortOrder
    eligibleForFourthMentorCall?: SortOrder
    eligibleForFifthMentorCall?: SortOrder
    fourthMentorCallCompletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    fifthMentorCallCompletedAt?: SortOrder
    firstMentorCallCompletedAt?: SortOrder
    secondMentorCallCompletedAt?: SortOrder
    thirdMentorCallCompletedAt?: SortOrder
    fifthMentorCallGoogleMeetLink?: SortOrder
    fifthMentorCallScheduledAt?: SortOrder
    finalReview?: SortOrder
    firstMentorCallGoogleMeetLink?: SortOrder
    firstMentorCallScheduledAt?: SortOrder
    fourthMentorCallGoogleMeetLink?: SortOrder
    fourthMentorCallScheduledAt?: SortOrder
    secondMentorCallGoogleMeetLink?: SortOrder
    secondMentorCallScheduledAt?: SortOrder
    thirdMentorCallGoogleMeetLink?: SortOrder
    thirdMentorCallScheduledAt?: SortOrder
  }

  export type UserStatusMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    orientation?: SortOrder
    resumeRebuilding?: SortOrder
    eligibleForFirstMentorCall?: SortOrder
    resumeConfirmed?: SortOrder
    portfolioBuildingAndConfirmed?: SortOrder
    eligibleForSecondMentorCall?: SortOrder
    paymentMade?: SortOrder
    techDistributionAndExtension?: SortOrder
    eligibleForThirdMentorCall?: SortOrder
    cheatSheetBuiltOut?: SortOrder
    hasAppliedEnoughJobs?: SortOrder
    eligibleForFourthMentorCall?: SortOrder
    eligibleForFifthMentorCall?: SortOrder
    fourthMentorCallCompletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    fifthMentorCallCompletedAt?: SortOrder
    firstMentorCallCompletedAt?: SortOrder
    secondMentorCallCompletedAt?: SortOrder
    thirdMentorCallCompletedAt?: SortOrder
    fifthMentorCallGoogleMeetLink?: SortOrder
    fifthMentorCallScheduledAt?: SortOrder
    finalReview?: SortOrder
    firstMentorCallGoogleMeetLink?: SortOrder
    firstMentorCallScheduledAt?: SortOrder
    fourthMentorCallGoogleMeetLink?: SortOrder
    fourthMentorCallScheduledAt?: SortOrder
    secondMentorCallGoogleMeetLink?: SortOrder
    secondMentorCallScheduledAt?: SortOrder
    thirdMentorCallGoogleMeetLink?: SortOrder
    thirdMentorCallScheduledAt?: SortOrder
  }

  export type ApiKeyCreateNestedManyWithoutUserInput = {
    create?: XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput> | ApiKeyCreateWithoutUserInput[] | ApiKeyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutUserInput | ApiKeyCreateOrConnectWithoutUserInput[]
    createMany?: ApiKeyCreateManyUserInputEnvelope
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
  }

  export type AppliedJobCreateNestedManyWithoutUserInput = {
    create?: XOR<AppliedJobCreateWithoutUserInput, AppliedJobUncheckedCreateWithoutUserInput> | AppliedJobCreateWithoutUserInput[] | AppliedJobUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AppliedJobCreateOrConnectWithoutUserInput | AppliedJobCreateOrConnectWithoutUserInput[]
    createMany?: AppliedJobCreateManyUserInputEnvelope
    connect?: AppliedJobWhereUniqueInput | AppliedJobWhereUniqueInput[]
  }

  export type ProgressCreateNestedOneWithoutUserInput = {
    create?: XOR<ProgressCreateWithoutUserInput, ProgressUncheckedCreateWithoutUserInput>
    connectOrCreate?: ProgressCreateOrConnectWithoutUserInput
    connect?: ProgressWhereUniqueInput
  }

  export type AdminMentorCreateNestedOneWithoutUserInput = {
    create?: XOR<AdminMentorCreateWithoutUserInput, AdminMentorUncheckedCreateWithoutUserInput>
    connectOrCreate?: AdminMentorCreateOrConnectWithoutUserInput
    connect?: AdminMentorWhereUniqueInput
  }

  export type UserStatusCreateNestedOneWithoutUserInput = {
    create?: XOR<UserStatusCreateWithoutUserInput, UserStatusUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserStatusCreateOrConnectWithoutUserInput
    connect?: UserStatusWhereUniqueInput
  }

  export type ApiKeyUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput> | ApiKeyCreateWithoutUserInput[] | ApiKeyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutUserInput | ApiKeyCreateOrConnectWithoutUserInput[]
    createMany?: ApiKeyCreateManyUserInputEnvelope
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
  }

  export type AppliedJobUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AppliedJobCreateWithoutUserInput, AppliedJobUncheckedCreateWithoutUserInput> | AppliedJobCreateWithoutUserInput[] | AppliedJobUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AppliedJobCreateOrConnectWithoutUserInput | AppliedJobCreateOrConnectWithoutUserInput[]
    createMany?: AppliedJobCreateManyUserInputEnvelope
    connect?: AppliedJobWhereUniqueInput | AppliedJobWhereUniqueInput[]
  }

  export type ProgressUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<ProgressCreateWithoutUserInput, ProgressUncheckedCreateWithoutUserInput>
    connectOrCreate?: ProgressCreateOrConnectWithoutUserInput
    connect?: ProgressWhereUniqueInput
  }

  export type UserStatusUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<UserStatusCreateWithoutUserInput, UserStatusUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserStatusCreateOrConnectWithoutUserInput
    connect?: UserStatusWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ApiKeyUpdateManyWithoutUserNestedInput = {
    create?: XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput> | ApiKeyCreateWithoutUserInput[] | ApiKeyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutUserInput | ApiKeyCreateOrConnectWithoutUserInput[]
    upsert?: ApiKeyUpsertWithWhereUniqueWithoutUserInput | ApiKeyUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ApiKeyCreateManyUserInputEnvelope
    set?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    disconnect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    delete?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    update?: ApiKeyUpdateWithWhereUniqueWithoutUserInput | ApiKeyUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ApiKeyUpdateManyWithWhereWithoutUserInput | ApiKeyUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
  }

  export type AppliedJobUpdateManyWithoutUserNestedInput = {
    create?: XOR<AppliedJobCreateWithoutUserInput, AppliedJobUncheckedCreateWithoutUserInput> | AppliedJobCreateWithoutUserInput[] | AppliedJobUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AppliedJobCreateOrConnectWithoutUserInput | AppliedJobCreateOrConnectWithoutUserInput[]
    upsert?: AppliedJobUpsertWithWhereUniqueWithoutUserInput | AppliedJobUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AppliedJobCreateManyUserInputEnvelope
    set?: AppliedJobWhereUniqueInput | AppliedJobWhereUniqueInput[]
    disconnect?: AppliedJobWhereUniqueInput | AppliedJobWhereUniqueInput[]
    delete?: AppliedJobWhereUniqueInput | AppliedJobWhereUniqueInput[]
    connect?: AppliedJobWhereUniqueInput | AppliedJobWhereUniqueInput[]
    update?: AppliedJobUpdateWithWhereUniqueWithoutUserInput | AppliedJobUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AppliedJobUpdateManyWithWhereWithoutUserInput | AppliedJobUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AppliedJobScalarWhereInput | AppliedJobScalarWhereInput[]
  }

  export type ProgressUpdateOneWithoutUserNestedInput = {
    create?: XOR<ProgressCreateWithoutUserInput, ProgressUncheckedCreateWithoutUserInput>
    connectOrCreate?: ProgressCreateOrConnectWithoutUserInput
    upsert?: ProgressUpsertWithoutUserInput
    disconnect?: ProgressWhereInput | boolean
    delete?: ProgressWhereInput | boolean
    connect?: ProgressWhereUniqueInput
    update?: XOR<XOR<ProgressUpdateToOneWithWhereWithoutUserInput, ProgressUpdateWithoutUserInput>, ProgressUncheckedUpdateWithoutUserInput>
  }

  export type AdminMentorUpdateOneWithoutUserNestedInput = {
    create?: XOR<AdminMentorCreateWithoutUserInput, AdminMentorUncheckedCreateWithoutUserInput>
    connectOrCreate?: AdminMentorCreateOrConnectWithoutUserInput
    upsert?: AdminMentorUpsertWithoutUserInput
    disconnect?: AdminMentorWhereInput | boolean
    delete?: AdminMentorWhereInput | boolean
    connect?: AdminMentorWhereUniqueInput
    update?: XOR<XOR<AdminMentorUpdateToOneWithWhereWithoutUserInput, AdminMentorUpdateWithoutUserInput>, AdminMentorUncheckedUpdateWithoutUserInput>
  }

  export type UserStatusUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserStatusCreateWithoutUserInput, UserStatusUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserStatusCreateOrConnectWithoutUserInput
    upsert?: UserStatusUpsertWithoutUserInput
    disconnect?: UserStatusWhereInput | boolean
    delete?: UserStatusWhereInput | boolean
    connect?: UserStatusWhereUniqueInput
    update?: XOR<XOR<UserStatusUpdateToOneWithWhereWithoutUserInput, UserStatusUpdateWithoutUserInput>, UserStatusUncheckedUpdateWithoutUserInput>
  }

  export type ApiKeyUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput> | ApiKeyCreateWithoutUserInput[] | ApiKeyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutUserInput | ApiKeyCreateOrConnectWithoutUserInput[]
    upsert?: ApiKeyUpsertWithWhereUniqueWithoutUserInput | ApiKeyUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ApiKeyCreateManyUserInputEnvelope
    set?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    disconnect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    delete?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    update?: ApiKeyUpdateWithWhereUniqueWithoutUserInput | ApiKeyUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ApiKeyUpdateManyWithWhereWithoutUserInput | ApiKeyUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
  }

  export type AppliedJobUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AppliedJobCreateWithoutUserInput, AppliedJobUncheckedCreateWithoutUserInput> | AppliedJobCreateWithoutUserInput[] | AppliedJobUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AppliedJobCreateOrConnectWithoutUserInput | AppliedJobCreateOrConnectWithoutUserInput[]
    upsert?: AppliedJobUpsertWithWhereUniqueWithoutUserInput | AppliedJobUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AppliedJobCreateManyUserInputEnvelope
    set?: AppliedJobWhereUniqueInput | AppliedJobWhereUniqueInput[]
    disconnect?: AppliedJobWhereUniqueInput | AppliedJobWhereUniqueInput[]
    delete?: AppliedJobWhereUniqueInput | AppliedJobWhereUniqueInput[]
    connect?: AppliedJobWhereUniqueInput | AppliedJobWhereUniqueInput[]
    update?: AppliedJobUpdateWithWhereUniqueWithoutUserInput | AppliedJobUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AppliedJobUpdateManyWithWhereWithoutUserInput | AppliedJobUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AppliedJobScalarWhereInput | AppliedJobScalarWhereInput[]
  }

  export type ProgressUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<ProgressCreateWithoutUserInput, ProgressUncheckedCreateWithoutUserInput>
    connectOrCreate?: ProgressCreateOrConnectWithoutUserInput
    upsert?: ProgressUpsertWithoutUserInput
    disconnect?: ProgressWhereInput | boolean
    delete?: ProgressWhereInput | boolean
    connect?: ProgressWhereUniqueInput
    update?: XOR<XOR<ProgressUpdateToOneWithWhereWithoutUserInput, ProgressUpdateWithoutUserInput>, ProgressUncheckedUpdateWithoutUserInput>
  }

  export type UserStatusUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserStatusCreateWithoutUserInput, UserStatusUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserStatusCreateOrConnectWithoutUserInput
    upsert?: UserStatusUpsertWithoutUserInput
    disconnect?: UserStatusWhereInput | boolean
    delete?: UserStatusWhereInput | boolean
    connect?: UserStatusWhereUniqueInput
    update?: XOR<XOR<UserStatusUpdateToOneWithWhereWithoutUserInput, UserStatusUpdateWithoutUserInput>, UserStatusUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutApiKeysInput = {
    create?: XOR<UserCreateWithoutApiKeysInput, UserUncheckedCreateWithoutApiKeysInput>
    connectOrCreate?: UserCreateOrConnectWithoutApiKeysInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutApiKeysNestedInput = {
    create?: XOR<UserCreateWithoutApiKeysInput, UserUncheckedCreateWithoutApiKeysInput>
    connectOrCreate?: UserCreateOrConnectWithoutApiKeysInput
    upsert?: UserUpsertWithoutApiKeysInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutApiKeysInput, UserUpdateWithoutApiKeysInput>, UserUncheckedUpdateWithoutApiKeysInput>
  }

  export type UserCreateNestedOneWithoutAppliedJobsInput = {
    create?: XOR<UserCreateWithoutAppliedJobsInput, UserUncheckedCreateWithoutAppliedJobsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAppliedJobsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAppliedJobsNestedInput = {
    create?: XOR<UserCreateWithoutAppliedJobsInput, UserUncheckedCreateWithoutAppliedJobsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAppliedJobsInput
    upsert?: UserUpsertWithoutAppliedJobsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAppliedJobsInput, UserUpdateWithoutAppliedJobsInput>, UserUncheckedUpdateWithoutAppliedJobsInput>
  }

  export type UserCreateNestedOneWithoutProgressInput = {
    create?: XOR<UserCreateWithoutProgressInput, UserUncheckedCreateWithoutProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutProgressInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutProgressNestedInput = {
    create?: XOR<UserCreateWithoutProgressInput, UserUncheckedCreateWithoutProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutProgressInput
    upsert?: UserUpsertWithoutProgressInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProgressInput, UserUpdateWithoutProgressInput>, UserUncheckedUpdateWithoutProgressInput>
  }

  export type UserCreateNestedManyWithoutAdminMentorInput = {
    create?: XOR<UserCreateWithoutAdminMentorInput, UserUncheckedCreateWithoutAdminMentorInput> | UserCreateWithoutAdminMentorInput[] | UserUncheckedCreateWithoutAdminMentorInput[]
    connectOrCreate?: UserCreateOrConnectWithoutAdminMentorInput | UserCreateOrConnectWithoutAdminMentorInput[]
    createMany?: UserCreateManyAdminMentorInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutAdminMentorInput = {
    create?: XOR<UserCreateWithoutAdminMentorInput, UserUncheckedCreateWithoutAdminMentorInput> | UserCreateWithoutAdminMentorInput[] | UserUncheckedCreateWithoutAdminMentorInput[]
    connectOrCreate?: UserCreateOrConnectWithoutAdminMentorInput | UserCreateOrConnectWithoutAdminMentorInput[]
    createMany?: UserCreateManyAdminMentorInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUpdateManyWithoutAdminMentorNestedInput = {
    create?: XOR<UserCreateWithoutAdminMentorInput, UserUncheckedCreateWithoutAdminMentorInput> | UserCreateWithoutAdminMentorInput[] | UserUncheckedCreateWithoutAdminMentorInput[]
    connectOrCreate?: UserCreateOrConnectWithoutAdminMentorInput | UserCreateOrConnectWithoutAdminMentorInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutAdminMentorInput | UserUpsertWithWhereUniqueWithoutAdminMentorInput[]
    createMany?: UserCreateManyAdminMentorInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutAdminMentorInput | UserUpdateWithWhereUniqueWithoutAdminMentorInput[]
    updateMany?: UserUpdateManyWithWhereWithoutAdminMentorInput | UserUpdateManyWithWhereWithoutAdminMentorInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutAdminMentorNestedInput = {
    create?: XOR<UserCreateWithoutAdminMentorInput, UserUncheckedCreateWithoutAdminMentorInput> | UserCreateWithoutAdminMentorInput[] | UserUncheckedCreateWithoutAdminMentorInput[]
    connectOrCreate?: UserCreateOrConnectWithoutAdminMentorInput | UserCreateOrConnectWithoutAdminMentorInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutAdminMentorInput | UserUpsertWithWhereUniqueWithoutAdminMentorInput[]
    createMany?: UserCreateManyAdminMentorInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutAdminMentorInput | UserUpdateWithWhereUniqueWithoutAdminMentorInput[]
    updateMany?: UserUpdateManyWithWhereWithoutAdminMentorInput | UserUpdateManyWithWhereWithoutAdminMentorInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutUserStatusInput = {
    create?: XOR<UserCreateWithoutUserStatusInput, UserUncheckedCreateWithoutUserStatusInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserStatusInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutUserStatusNestedInput = {
    create?: XOR<UserCreateWithoutUserStatusInput, UserUncheckedCreateWithoutUserStatusInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserStatusInput
    upsert?: UserUpsertWithoutUserStatusInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUserStatusInput, UserUpdateWithoutUserStatusInput>, UserUncheckedUpdateWithoutUserStatusInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ApiKeyCreateWithoutUserInput = {
    id?: string
    key: string
    name: string
    createdAt?: Date | string
    lastUsedAt?: Date | string | null
    isActive?: boolean
    deletedAt?: Date | string | null
  }

  export type ApiKeyUncheckedCreateWithoutUserInput = {
    id?: string
    key: string
    name: string
    createdAt?: Date | string
    lastUsedAt?: Date | string | null
    isActive?: boolean
    deletedAt?: Date | string | null
  }

  export type ApiKeyCreateOrConnectWithoutUserInput = {
    where: ApiKeyWhereUniqueInput
    create: XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput>
  }

  export type ApiKeyCreateManyUserInputEnvelope = {
    data: ApiKeyCreateManyUserInput | ApiKeyCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AppliedJobCreateWithoutUserInput = {
    id?: string
    title: string
    company?: string | null
    location?: string | null
    url: string
    appliedDate?: Date | string
    appliedText?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    type?: string
    deletedAt?: Date | string | null
  }

  export type AppliedJobUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    company?: string | null
    location?: string | null
    url: string
    appliedDate?: Date | string
    appliedText?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    type?: string
    deletedAt?: Date | string | null
  }

  export type AppliedJobCreateOrConnectWithoutUserInput = {
    where: AppliedJobWhereUniqueInput
    create: XOR<AppliedJobCreateWithoutUserInput, AppliedJobUncheckedCreateWithoutUserInput>
  }

  export type AppliedJobCreateManyUserInputEnvelope = {
    data: AppliedJobCreateManyUserInput | AppliedJobCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ProgressCreateWithoutUserInput = {
    id: string
    weeks: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt: Date | string
    deletedAt?: Date | string | null
  }

  export type ProgressUncheckedCreateWithoutUserInput = {
    id: string
    weeks: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt: Date | string
    deletedAt?: Date | string | null
  }

  export type ProgressCreateOrConnectWithoutUserInput = {
    where: ProgressWhereUniqueInput
    create: XOR<ProgressCreateWithoutUserInput, ProgressUncheckedCreateWithoutUserInput>
  }

  export type AdminMentorCreateWithoutUserInput = {
    id: string
    email: string
    password: string
    name: string
    picture?: string | null
    expertise?: string | null
    background?: string | null
    availability?: string | null
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt: Date | string
    deletedAt?: Date | string | null
    company?: string | null
    role?: string | null
    verifiedByAdmin?: boolean
  }

  export type AdminMentorUncheckedCreateWithoutUserInput = {
    id: string
    email: string
    password: string
    name: string
    picture?: string | null
    expertise?: string | null
    background?: string | null
    availability?: string | null
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt: Date | string
    deletedAt?: Date | string | null
    company?: string | null
    role?: string | null
    verifiedByAdmin?: boolean
  }

  export type AdminMentorCreateOrConnectWithoutUserInput = {
    where: AdminMentorWhereUniqueInput
    create: XOR<AdminMentorCreateWithoutUserInput, AdminMentorUncheckedCreateWithoutUserInput>
  }

  export type UserStatusCreateWithoutUserInput = {
    id: string
    orientation?: boolean
    resumeRebuilding?: boolean
    eligibleForFirstMentorCall?: boolean
    resumeConfirmed?: boolean
    portfolioBuildingAndConfirmed?: boolean
    eligibleForSecondMentorCall?: boolean
    paymentMade?: boolean
    techDistributionAndExtension?: boolean
    eligibleForThirdMentorCall?: boolean
    cheatSheetBuiltOut?: boolean
    hasAppliedEnoughJobs?: boolean
    eligibleForFourthMentorCall?: boolean
    eligibleForFifthMentorCall?: boolean
    fourthMentorCallCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt: Date | string
    deletedAt?: Date | string | null
    fifthMentorCallCompletedAt?: Date | string | null
    firstMentorCallCompletedAt?: Date | string | null
    secondMentorCallCompletedAt?: Date | string | null
    thirdMentorCallCompletedAt?: Date | string | null
    fifthMentorCallGoogleMeetLink?: string | null
    fifthMentorCallScheduledAt?: Date | string | null
    finalReview?: boolean
    firstMentorCallGoogleMeetLink?: string | null
    firstMentorCallScheduledAt?: Date | string | null
    fourthMentorCallGoogleMeetLink?: string | null
    fourthMentorCallScheduledAt?: Date | string | null
    secondMentorCallGoogleMeetLink?: string | null
    secondMentorCallScheduledAt?: Date | string | null
    thirdMentorCallGoogleMeetLink?: string | null
    thirdMentorCallScheduledAt?: Date | string | null
  }

  export type UserStatusUncheckedCreateWithoutUserInput = {
    id: string
    orientation?: boolean
    resumeRebuilding?: boolean
    eligibleForFirstMentorCall?: boolean
    resumeConfirmed?: boolean
    portfolioBuildingAndConfirmed?: boolean
    eligibleForSecondMentorCall?: boolean
    paymentMade?: boolean
    techDistributionAndExtension?: boolean
    eligibleForThirdMentorCall?: boolean
    cheatSheetBuiltOut?: boolean
    hasAppliedEnoughJobs?: boolean
    eligibleForFourthMentorCall?: boolean
    eligibleForFifthMentorCall?: boolean
    fourthMentorCallCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt: Date | string
    deletedAt?: Date | string | null
    fifthMentorCallCompletedAt?: Date | string | null
    firstMentorCallCompletedAt?: Date | string | null
    secondMentorCallCompletedAt?: Date | string | null
    thirdMentorCallCompletedAt?: Date | string | null
    fifthMentorCallGoogleMeetLink?: string | null
    fifthMentorCallScheduledAt?: Date | string | null
    finalReview?: boolean
    firstMentorCallGoogleMeetLink?: string | null
    firstMentorCallScheduledAt?: Date | string | null
    fourthMentorCallGoogleMeetLink?: string | null
    fourthMentorCallScheduledAt?: Date | string | null
    secondMentorCallGoogleMeetLink?: string | null
    secondMentorCallScheduledAt?: Date | string | null
    thirdMentorCallGoogleMeetLink?: string | null
    thirdMentorCallScheduledAt?: Date | string | null
  }

  export type UserStatusCreateOrConnectWithoutUserInput = {
    where: UserStatusWhereUniqueInput
    create: XOR<UserStatusCreateWithoutUserInput, UserStatusUncheckedCreateWithoutUserInput>
  }

  export type ApiKeyUpsertWithWhereUniqueWithoutUserInput = {
    where: ApiKeyWhereUniqueInput
    update: XOR<ApiKeyUpdateWithoutUserInput, ApiKeyUncheckedUpdateWithoutUserInput>
    create: XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput>
  }

  export type ApiKeyUpdateWithWhereUniqueWithoutUserInput = {
    where: ApiKeyWhereUniqueInput
    data: XOR<ApiKeyUpdateWithoutUserInput, ApiKeyUncheckedUpdateWithoutUserInput>
  }

  export type ApiKeyUpdateManyWithWhereWithoutUserInput = {
    where: ApiKeyScalarWhereInput
    data: XOR<ApiKeyUpdateManyMutationInput, ApiKeyUncheckedUpdateManyWithoutUserInput>
  }

  export type ApiKeyScalarWhereInput = {
    AND?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
    OR?: ApiKeyScalarWhereInput[]
    NOT?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
    id?: StringFilter<"ApiKey"> | string
    key?: StringFilter<"ApiKey"> | string
    name?: StringFilter<"ApiKey"> | string
    userId?: StringFilter<"ApiKey"> | string
    createdAt?: DateTimeFilter<"ApiKey"> | Date | string
    lastUsedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null
    isActive?: BoolFilter<"ApiKey"> | boolean
    deletedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null
  }

  export type AppliedJobUpsertWithWhereUniqueWithoutUserInput = {
    where: AppliedJobWhereUniqueInput
    update: XOR<AppliedJobUpdateWithoutUserInput, AppliedJobUncheckedUpdateWithoutUserInput>
    create: XOR<AppliedJobCreateWithoutUserInput, AppliedJobUncheckedCreateWithoutUserInput>
  }

  export type AppliedJobUpdateWithWhereUniqueWithoutUserInput = {
    where: AppliedJobWhereUniqueInput
    data: XOR<AppliedJobUpdateWithoutUserInput, AppliedJobUncheckedUpdateWithoutUserInput>
  }

  export type AppliedJobUpdateManyWithWhereWithoutUserInput = {
    where: AppliedJobScalarWhereInput
    data: XOR<AppliedJobUpdateManyMutationInput, AppliedJobUncheckedUpdateManyWithoutUserInput>
  }

  export type AppliedJobScalarWhereInput = {
    AND?: AppliedJobScalarWhereInput | AppliedJobScalarWhereInput[]
    OR?: AppliedJobScalarWhereInput[]
    NOT?: AppliedJobScalarWhereInput | AppliedJobScalarWhereInput[]
    id?: StringFilter<"AppliedJob"> | string
    userId?: StringFilter<"AppliedJob"> | string
    title?: StringFilter<"AppliedJob"> | string
    company?: StringNullableFilter<"AppliedJob"> | string | null
    location?: StringNullableFilter<"AppliedJob"> | string | null
    url?: StringFilter<"AppliedJob"> | string
    appliedDate?: DateTimeFilter<"AppliedJob"> | Date | string
    appliedText?: StringNullableFilter<"AppliedJob"> | string | null
    status?: StringFilter<"AppliedJob"> | string
    createdAt?: DateTimeFilter<"AppliedJob"> | Date | string
    updatedAt?: DateTimeFilter<"AppliedJob"> | Date | string
    type?: StringFilter<"AppliedJob"> | string
    deletedAt?: DateTimeNullableFilter<"AppliedJob"> | Date | string | null
  }

  export type ProgressUpsertWithoutUserInput = {
    update: XOR<ProgressUpdateWithoutUserInput, ProgressUncheckedUpdateWithoutUserInput>
    create: XOR<ProgressCreateWithoutUserInput, ProgressUncheckedCreateWithoutUserInput>
    where?: ProgressWhereInput
  }

  export type ProgressUpdateToOneWithWhereWithoutUserInput = {
    where?: ProgressWhereInput
    data: XOR<ProgressUpdateWithoutUserInput, ProgressUncheckedUpdateWithoutUserInput>
  }

  export type ProgressUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    weeks?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProgressUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    weeks?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AdminMentorUpsertWithoutUserInput = {
    update: XOR<AdminMentorUpdateWithoutUserInput, AdminMentorUncheckedUpdateWithoutUserInput>
    create: XOR<AdminMentorCreateWithoutUserInput, AdminMentorUncheckedCreateWithoutUserInput>
    where?: AdminMentorWhereInput
  }

  export type AdminMentorUpdateToOneWithWhereWithoutUserInput = {
    where?: AdminMentorWhereInput
    data: XOR<AdminMentorUpdateWithoutUserInput, AdminMentorUncheckedUpdateWithoutUserInput>
  }

  export type AdminMentorUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    expertise?: NullableStringFieldUpdateOperationsInput | string | null
    background?: NullableStringFieldUpdateOperationsInput | string | null
    availability?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedByAdmin?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AdminMentorUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    expertise?: NullableStringFieldUpdateOperationsInput | string | null
    background?: NullableStringFieldUpdateOperationsInput | string | null
    availability?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedByAdmin?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserStatusUpsertWithoutUserInput = {
    update: XOR<UserStatusUpdateWithoutUserInput, UserStatusUncheckedUpdateWithoutUserInput>
    create: XOR<UserStatusCreateWithoutUserInput, UserStatusUncheckedCreateWithoutUserInput>
    where?: UserStatusWhereInput
  }

  export type UserStatusUpdateToOneWithWhereWithoutUserInput = {
    where?: UserStatusWhereInput
    data: XOR<UserStatusUpdateWithoutUserInput, UserStatusUncheckedUpdateWithoutUserInput>
  }

  export type UserStatusUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    orientation?: BoolFieldUpdateOperationsInput | boolean
    resumeRebuilding?: BoolFieldUpdateOperationsInput | boolean
    eligibleForFirstMentorCall?: BoolFieldUpdateOperationsInput | boolean
    resumeConfirmed?: BoolFieldUpdateOperationsInput | boolean
    portfolioBuildingAndConfirmed?: BoolFieldUpdateOperationsInput | boolean
    eligibleForSecondMentorCall?: BoolFieldUpdateOperationsInput | boolean
    paymentMade?: BoolFieldUpdateOperationsInput | boolean
    techDistributionAndExtension?: BoolFieldUpdateOperationsInput | boolean
    eligibleForThirdMentorCall?: BoolFieldUpdateOperationsInput | boolean
    cheatSheetBuiltOut?: BoolFieldUpdateOperationsInput | boolean
    hasAppliedEnoughJobs?: BoolFieldUpdateOperationsInput | boolean
    eligibleForFourthMentorCall?: BoolFieldUpdateOperationsInput | boolean
    eligibleForFifthMentorCall?: BoolFieldUpdateOperationsInput | boolean
    fourthMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fifthMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firstMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    secondMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    thirdMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fifthMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    fifthMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finalReview?: BoolFieldUpdateOperationsInput | boolean
    firstMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    firstMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fourthMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    fourthMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    secondMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    secondMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    thirdMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    thirdMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserStatusUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    orientation?: BoolFieldUpdateOperationsInput | boolean
    resumeRebuilding?: BoolFieldUpdateOperationsInput | boolean
    eligibleForFirstMentorCall?: BoolFieldUpdateOperationsInput | boolean
    resumeConfirmed?: BoolFieldUpdateOperationsInput | boolean
    portfolioBuildingAndConfirmed?: BoolFieldUpdateOperationsInput | boolean
    eligibleForSecondMentorCall?: BoolFieldUpdateOperationsInput | boolean
    paymentMade?: BoolFieldUpdateOperationsInput | boolean
    techDistributionAndExtension?: BoolFieldUpdateOperationsInput | boolean
    eligibleForThirdMentorCall?: BoolFieldUpdateOperationsInput | boolean
    cheatSheetBuiltOut?: BoolFieldUpdateOperationsInput | boolean
    hasAppliedEnoughJobs?: BoolFieldUpdateOperationsInput | boolean
    eligibleForFourthMentorCall?: BoolFieldUpdateOperationsInput | boolean
    eligibleForFifthMentorCall?: BoolFieldUpdateOperationsInput | boolean
    fourthMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fifthMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firstMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    secondMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    thirdMentorCallCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fifthMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    fifthMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finalReview?: BoolFieldUpdateOperationsInput | boolean
    firstMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    firstMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fourthMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    fourthMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    secondMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    secondMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    thirdMentorCallGoogleMeetLink?: NullableStringFieldUpdateOperationsInput | string | null
    thirdMentorCallScheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserCreateWithoutApiKeysInput = {
    id?: string
    firebaseUid: string
    email: string
    fullName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    goalPerDay?: number
    deletedAt?: Date | string | null
    verifiedByAdmin?: boolean
    appliedJobs?: AppliedJobCreateNestedManyWithoutUserInput
    Progress?: ProgressCreateNestedOneWithoutUserInput
    AdminMentor?: AdminMentorCreateNestedOneWithoutUserInput
    UserStatus?: UserStatusCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutApiKeysInput = {
    id?: string
    firebaseUid: string
    email: string
    fullName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    goalPerDay?: number
    mentorId?: string | null
    deletedAt?: Date | string | null
    verifiedByAdmin?: boolean
    appliedJobs?: AppliedJobUncheckedCreateNestedManyWithoutUserInput
    Progress?: ProgressUncheckedCreateNestedOneWithoutUserInput
    UserStatus?: UserStatusUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutApiKeysInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutApiKeysInput, UserUncheckedCreateWithoutApiKeysInput>
  }

  export type UserUpsertWithoutApiKeysInput = {
    update: XOR<UserUpdateWithoutApiKeysInput, UserUncheckedUpdateWithoutApiKeysInput>
    create: XOR<UserCreateWithoutApiKeysInput, UserUncheckedCreateWithoutApiKeysInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutApiKeysInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutApiKeysInput, UserUncheckedUpdateWithoutApiKeysInput>
  }

  export type UserUpdateWithoutApiKeysInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    goalPerDay?: IntFieldUpdateOperationsInput | number
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedByAdmin?: BoolFieldUpdateOperationsInput | boolean
    appliedJobs?: AppliedJobUpdateManyWithoutUserNestedInput
    Progress?: ProgressUpdateOneWithoutUserNestedInput
    AdminMentor?: AdminMentorUpdateOneWithoutUserNestedInput
    UserStatus?: UserStatusUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutApiKeysInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    goalPerDay?: IntFieldUpdateOperationsInput | number
    mentorId?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedByAdmin?: BoolFieldUpdateOperationsInput | boolean
    appliedJobs?: AppliedJobUncheckedUpdateManyWithoutUserNestedInput
    Progress?: ProgressUncheckedUpdateOneWithoutUserNestedInput
    UserStatus?: UserStatusUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutAppliedJobsInput = {
    id?: string
    firebaseUid: string
    email: string
    fullName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    goalPerDay?: number
    deletedAt?: Date | string | null
    verifiedByAdmin?: boolean
    apiKeys?: ApiKeyCreateNestedManyWithoutUserInput
    Progress?: ProgressCreateNestedOneWithoutUserInput
    AdminMentor?: AdminMentorCreateNestedOneWithoutUserInput
    UserStatus?: UserStatusCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAppliedJobsInput = {
    id?: string
    firebaseUid: string
    email: string
    fullName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    goalPerDay?: number
    mentorId?: string | null
    deletedAt?: Date | string | null
    verifiedByAdmin?: boolean
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutUserInput
    Progress?: ProgressUncheckedCreateNestedOneWithoutUserInput
    UserStatus?: UserStatusUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAppliedJobsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAppliedJobsInput, UserUncheckedCreateWithoutAppliedJobsInput>
  }

  export type UserUpsertWithoutAppliedJobsInput = {
    update: XOR<UserUpdateWithoutAppliedJobsInput, UserUncheckedUpdateWithoutAppliedJobsInput>
    create: XOR<UserCreateWithoutAppliedJobsInput, UserUncheckedCreateWithoutAppliedJobsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAppliedJobsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAppliedJobsInput, UserUncheckedUpdateWithoutAppliedJobsInput>
  }

  export type UserUpdateWithoutAppliedJobsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    goalPerDay?: IntFieldUpdateOperationsInput | number
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedByAdmin?: BoolFieldUpdateOperationsInput | boolean
    apiKeys?: ApiKeyUpdateManyWithoutUserNestedInput
    Progress?: ProgressUpdateOneWithoutUserNestedInput
    AdminMentor?: AdminMentorUpdateOneWithoutUserNestedInput
    UserStatus?: UserStatusUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAppliedJobsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    goalPerDay?: IntFieldUpdateOperationsInput | number
    mentorId?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedByAdmin?: BoolFieldUpdateOperationsInput | boolean
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutUserNestedInput
    Progress?: ProgressUncheckedUpdateOneWithoutUserNestedInput
    UserStatus?: UserStatusUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutProgressInput = {
    id?: string
    firebaseUid: string
    email: string
    fullName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    goalPerDay?: number
    deletedAt?: Date | string | null
    verifiedByAdmin?: boolean
    apiKeys?: ApiKeyCreateNestedManyWithoutUserInput
    appliedJobs?: AppliedJobCreateNestedManyWithoutUserInput
    AdminMentor?: AdminMentorCreateNestedOneWithoutUserInput
    UserStatus?: UserStatusCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutProgressInput = {
    id?: string
    firebaseUid: string
    email: string
    fullName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    goalPerDay?: number
    mentorId?: string | null
    deletedAt?: Date | string | null
    verifiedByAdmin?: boolean
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutUserInput
    appliedJobs?: AppliedJobUncheckedCreateNestedManyWithoutUserInput
    UserStatus?: UserStatusUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutProgressInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProgressInput, UserUncheckedCreateWithoutProgressInput>
  }

  export type UserUpsertWithoutProgressInput = {
    update: XOR<UserUpdateWithoutProgressInput, UserUncheckedUpdateWithoutProgressInput>
    create: XOR<UserCreateWithoutProgressInput, UserUncheckedCreateWithoutProgressInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProgressInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProgressInput, UserUncheckedUpdateWithoutProgressInput>
  }

  export type UserUpdateWithoutProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    goalPerDay?: IntFieldUpdateOperationsInput | number
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedByAdmin?: BoolFieldUpdateOperationsInput | boolean
    apiKeys?: ApiKeyUpdateManyWithoutUserNestedInput
    appliedJobs?: AppliedJobUpdateManyWithoutUserNestedInput
    AdminMentor?: AdminMentorUpdateOneWithoutUserNestedInput
    UserStatus?: UserStatusUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    goalPerDay?: IntFieldUpdateOperationsInput | number
    mentorId?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedByAdmin?: BoolFieldUpdateOperationsInput | boolean
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutUserNestedInput
    appliedJobs?: AppliedJobUncheckedUpdateManyWithoutUserNestedInput
    UserStatus?: UserStatusUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutAdminMentorInput = {
    id?: string
    firebaseUid: string
    email: string
    fullName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    goalPerDay?: number
    deletedAt?: Date | string | null
    verifiedByAdmin?: boolean
    apiKeys?: ApiKeyCreateNestedManyWithoutUserInput
    appliedJobs?: AppliedJobCreateNestedManyWithoutUserInput
    Progress?: ProgressCreateNestedOneWithoutUserInput
    UserStatus?: UserStatusCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAdminMentorInput = {
    id?: string
    firebaseUid: string
    email: string
    fullName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    goalPerDay?: number
    deletedAt?: Date | string | null
    verifiedByAdmin?: boolean
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutUserInput
    appliedJobs?: AppliedJobUncheckedCreateNestedManyWithoutUserInput
    Progress?: ProgressUncheckedCreateNestedOneWithoutUserInput
    UserStatus?: UserStatusUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAdminMentorInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAdminMentorInput, UserUncheckedCreateWithoutAdminMentorInput>
  }

  export type UserCreateManyAdminMentorInputEnvelope = {
    data: UserCreateManyAdminMentorInput | UserCreateManyAdminMentorInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutAdminMentorInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutAdminMentorInput, UserUncheckedUpdateWithoutAdminMentorInput>
    create: XOR<UserCreateWithoutAdminMentorInput, UserUncheckedCreateWithoutAdminMentorInput>
  }

  export type UserUpdateWithWhereUniqueWithoutAdminMentorInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutAdminMentorInput, UserUncheckedUpdateWithoutAdminMentorInput>
  }

  export type UserUpdateManyWithWhereWithoutAdminMentorInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutAdminMentorInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    firebaseUid?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    fullName?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    goalPerDay?: IntFilter<"User"> | number
    mentorId?: StringNullableFilter<"User"> | string | null
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    verifiedByAdmin?: BoolFilter<"User"> | boolean
  }

  export type UserCreateWithoutUserStatusInput = {
    id?: string
    firebaseUid: string
    email: string
    fullName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    goalPerDay?: number
    deletedAt?: Date | string | null
    verifiedByAdmin?: boolean
    apiKeys?: ApiKeyCreateNestedManyWithoutUserInput
    appliedJobs?: AppliedJobCreateNestedManyWithoutUserInput
    Progress?: ProgressCreateNestedOneWithoutUserInput
    AdminMentor?: AdminMentorCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutUserStatusInput = {
    id?: string
    firebaseUid: string
    email: string
    fullName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    goalPerDay?: number
    mentorId?: string | null
    deletedAt?: Date | string | null
    verifiedByAdmin?: boolean
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutUserInput
    appliedJobs?: AppliedJobUncheckedCreateNestedManyWithoutUserInput
    Progress?: ProgressUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutUserStatusInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUserStatusInput, UserUncheckedCreateWithoutUserStatusInput>
  }

  export type UserUpsertWithoutUserStatusInput = {
    update: XOR<UserUpdateWithoutUserStatusInput, UserUncheckedUpdateWithoutUserStatusInput>
    create: XOR<UserCreateWithoutUserStatusInput, UserUncheckedCreateWithoutUserStatusInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUserStatusInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUserStatusInput, UserUncheckedUpdateWithoutUserStatusInput>
  }

  export type UserUpdateWithoutUserStatusInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    goalPerDay?: IntFieldUpdateOperationsInput | number
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedByAdmin?: BoolFieldUpdateOperationsInput | boolean
    apiKeys?: ApiKeyUpdateManyWithoutUserNestedInput
    appliedJobs?: AppliedJobUpdateManyWithoutUserNestedInput
    Progress?: ProgressUpdateOneWithoutUserNestedInput
    AdminMentor?: AdminMentorUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUserStatusInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    goalPerDay?: IntFieldUpdateOperationsInput | number
    mentorId?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedByAdmin?: BoolFieldUpdateOperationsInput | boolean
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutUserNestedInput
    appliedJobs?: AppliedJobUncheckedUpdateManyWithoutUserNestedInput
    Progress?: ProgressUncheckedUpdateOneWithoutUserNestedInput
  }

  export type ApiKeyCreateManyUserInput = {
    id?: string
    key: string
    name: string
    createdAt?: Date | string
    lastUsedAt?: Date | string | null
    isActive?: boolean
    deletedAt?: Date | string | null
  }

  export type AppliedJobCreateManyUserInput = {
    id?: string
    title: string
    company?: string | null
    location?: string | null
    url: string
    appliedDate?: Date | string
    appliedText?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    type?: string
    deletedAt?: Date | string | null
  }

  export type ApiKeyUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ApiKeyUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ApiKeyUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AppliedJobUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    appliedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    appliedText?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AppliedJobUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    appliedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    appliedText?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AppliedJobUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    appliedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    appliedText?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserCreateManyAdminMentorInput = {
    id?: string
    firebaseUid: string
    email: string
    fullName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    goalPerDay?: number
    deletedAt?: Date | string | null
    verifiedByAdmin?: boolean
  }

  export type UserUpdateWithoutAdminMentorInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    goalPerDay?: IntFieldUpdateOperationsInput | number
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedByAdmin?: BoolFieldUpdateOperationsInput | boolean
    apiKeys?: ApiKeyUpdateManyWithoutUserNestedInput
    appliedJobs?: AppliedJobUpdateManyWithoutUserNestedInput
    Progress?: ProgressUpdateOneWithoutUserNestedInput
    UserStatus?: UserStatusUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAdminMentorInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    goalPerDay?: IntFieldUpdateOperationsInput | number
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedByAdmin?: BoolFieldUpdateOperationsInput | boolean
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutUserNestedInput
    appliedJobs?: AppliedJobUncheckedUpdateManyWithoutUserNestedInput
    Progress?: ProgressUncheckedUpdateOneWithoutUserNestedInput
    UserStatus?: UserStatusUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutAdminMentorInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    goalPerDay?: IntFieldUpdateOperationsInput | number
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedByAdmin?: BoolFieldUpdateOperationsInput | boolean
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}