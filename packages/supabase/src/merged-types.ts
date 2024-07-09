// import { MergeDeep } from 'type-fest';

// import { Database as DatabaseGenerated } from './types';

// export { type Json } from './types';

// // Override the type for a specific column in a view:
// export type Database = MergeDeep<
//   DatabaseGenerated,
//   {
//     public: {
//       Views: {
//         discount_rate_view: {
//           Row: MergeDeep<
//             DatabaseGenerated['public']['Tables']['discounts']['Row'],
//             { discount_rate: number }
//           >;
//         };
//       };
//     };
//   }
// >;
