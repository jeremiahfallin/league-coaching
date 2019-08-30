import React, { useState, useEffect } from "react"
import Error from "./ErrorMessage"
import styled from "styled-components"
import debounce from "lodash.debounce"
import { gql } from "apollo-boost"
import { useQuery, useMutation } from "@apollo/react-hooks"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

function ViewTeam() {
  const data = useStaticQuery(graphql`
    query {
      placeholderImage: file(relativePath: { eq: "images/Aatrox.png" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  return <Img fluid={data.placeholderImage.childImageSharp.fluid} />
}
