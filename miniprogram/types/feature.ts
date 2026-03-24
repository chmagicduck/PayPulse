export interface FeatureMeta {
  featureId: string
  title: string
  owner: string
  status: 'scaffold' | 'active' | 'deprecated'
  routePrefix: string
}
