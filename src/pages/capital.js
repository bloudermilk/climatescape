import React from "react"
import { graphql } from "gatsby"

import { transformOrganizations } from "../utils/airtable"

import Layout from "../components/layout"
import OrganizationCard from "../components/OrganizationCard"
import IndexHeader from "../components/IndexHeader"
import { useOrganizationFilterState } from "../components/OrganizationFilter"
import SEO from "../components/seo"

const CapitalTemplate = ({
  data: {
    organizations: { nodes },
    site,
  },
}) => {
  const [filter, setFilter, applyFilter] = useOrganizationFilterState()

  let organizations = transformOrganizations(nodes)
  organizations = applyFilter(organizations)

  return (
    <Layout contentClassName="bg-gray-100">
      <SEO
        title="Climate Capital on Climatescape"
        description="Find climate-friendly VCs, grants, project finance, and more on Climatescape"
      />

      <div className="max-w-4xl mx-auto pb-4">
        <IndexHeader
          title="Climate Capital"
          buttonText="Edit"
          buttonUrl={site.siteMetadata.capitalFormUrl}
          filter={filter}
          onClearFilter={() => setFilter.none()}
        />

        <div className="bg-white">
          {organizations.map(organization => (
            <OrganizationCard
              key={organization.title}
              organization={organization}
              currentFilter={filter}
              onApplyFilter={setFilter}
            />
          ))}
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query CapitalPageQuery {
    organizations: allAirtable(
      filter: {
        table: { eq: "Organizations" }
        data: { Role: { eq: "Capital" } }
      }
    ) {
      nodes {
        data {
          Name
          Homepage
          About
          Tagline
          HQ_Location
          Organization_Type
          Logo {
            localFiles {
              childImageSharp {
                fixed(
                  width: 64
                  height: 64
                  fit: CONTAIN
                  background: "white"
                ) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
          Categories {
            id
            data {
              Name
              Parent {
                id
                data {
                  Name
                }
              }
            }
          }
          Capital_Profile {
            data {
              Type
              Strategic
              Stage
              CheckSize: Check_Size
            }
          }
          LinkedIn_Profiles {
            data {
              Logo {
                localFiles {
                  childImageSharp {
                    fixed(
                      width: 64
                      height: 64
                      fit: CONTAIN
                      background: "white"
                    ) {
                      ...GatsbyImageSharpFixed
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    site {
      siteMetadata {
        capitalFormUrl
      }
    }
  }
`

export default CapitalTemplate
