import React from "react"
import { graphql } from "gatsby"
import { uniqBy } from "lodash"

import { transformCategories, transformOrganizations } from "../utils/airtable"

import Layout from "../components/layout"
import OrganizationCard from "../components/OrganizationCard"
import IndexHeader from "../components/IndexHeader"
import { useOrganizationFilterState } from "../components/OrganizationFilter"
import AddOrganizationCTA from "../components/AddOrganizationCTA"
import SEO from "../components/seo"
import CategoryList from "../components/CategoryList"

function OrganizationsTemplate({ data, pageContext }) {
  const [filter, setFilter, applyFilter] = useOrganizationFilterState()

  // We need to combine organizations from the query for sub-categories
  // and top-categories which might include duplicate orgs.
  const orgs = uniqBy(
    [...data.subOrganizations?.nodes, ...data.topOrganizations?.nodes],
    org => org.data.Name
  )

  let organizations = transformOrganizations(orgs)
  const categories = transformCategories(data)

  organizations = applyFilter(organizations)

  const organizationsTitle = pageContext.categoryName || "All Organizations"

  return (
    <Layout contentClassName="bg-gray-100">
      <SEO title={`${organizationsTitle} organizations on Climatescape`} />

      <div className="flex flex-col mx-auto container lg:flex-row font-sans">
        <CategoryList categories={categories} pageContext={pageContext} />
        <div className="lg:w-3/5">
          <IndexHeader
            title={organizationsTitle}
            filter={filter}
            onClearFilter={() => setFilter.none()}
          />

          <div className="">
            {organizations.map(org => (
              <OrganizationCard
                organization={org}
                pageContext={pageContext}
                key={org.title}
                currentFilter={filter}
                onApplyFilter={setFilter}
              />
            ))}
          </div>
          <div className="mb-3 mt-8 p-3 text-center ">
            <AddOrganizationCTA />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query OrganizationsPageQuery($categoryId: String) {
    categories: allAirtable(filter: { table: { eq: "Categories" } }) {
      nodes {
        id
        data {
          Name
          Count
          Parent {
            id
            data {
              Name
            }
          }
        }
      }
    }
    topOrganizations: allAirtable(
      filter: {
        table: { eq: "Organizations" }
        data: { Categories: { elemMatch: { id: { eq: $categoryId } } } }
      }
    ) {
      nodes {
        data {
          Name
          Homepage
          About
          Tags
          Tagline
          HQ_Location
          Organization_Type
          Headcount
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
          Logo {
            localFiles {
              childImageSharp {
                fixed(
                  width: 128
                  height: 128
                  fit: CONTAIN
                  background: "white"
                ) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
          LinkedIn_Profiles {
            data {
              Logo {
                localFiles {
                  childImageSharp {
                    fixed(
                      width: 128
                      height: 128
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
    subOrganizations: allAirtable(
      filter: {
        table: { eq: "Organizations" }
        data: {
          Categories: {
            elemMatch: {
              data: { Parent: { elemMatch: { id: { eq: $categoryId } } } }
            }
          }
        }
      }
    ) {
      nodes {
        data {
          Name
          Homepage
          About
          Tags
          Tagline
          HQ_Location
          Organization_Type
          Headcount
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
          Logo {
            localFiles {
              childImageSharp {
                fixed(
                  width: 128
                  height: 128
                  fit: CONTAIN
                  background: "white"
                ) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
          LinkedIn_Profiles {
            data {
              Logo {
                localFiles {
                  childImageSharp {
                    fixed(width: 128, height: 128, fit: CONTAIN) {
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
  }
`

export default OrganizationsTemplate
