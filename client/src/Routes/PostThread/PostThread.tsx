import { Trans, t } from "@lingui/macro"
import { I18n } from "@lingui/react"
import React, { Suspense } from "react"
import { useParams } from "react-router-dom"
import { useAuthContext } from "../../Context"
import RouteContainer from "../../UI/RouteContainer"
import { RouteAuthRequiredError, RouteGraphQLError } from "../../UI/RouteError"
import RouteLoader from "../../UI/RouteLoader"
import WindowTitle from "../../UI/WindowTitle"
import PostThreadForm from "./PostThreadForm"
import useCategoriesQuery from "./useCategoriesQuery"

interface IPostThreadRouteParams {
  id?: string
}

const PostThread: React.FC = () => {
  const params = useParams<IPostThreadRouteParams>()
  const user = useAuthContext()
  const { data, error, loading } = useCategoriesQuery()
  const categories = data ? data.categories : []

  // todo: filter unavailable categories
  // todo: display error if url category can't be posted in
  // todo: display error if url category couldn't be found

  if (!user) {
    return (
      <RouteAuthRequiredError
        header={
          <Trans id="post_thread.auth_error">
            You must be logged in to post a new thread.
          </Trans>
        }
      />
    )
  }

  if (!data) {
    if (error) return <RouteGraphQLError error={error} />
    if (loading) return <RouteLoader />
  }

  return (
    <Suspense fallback={<RouteLoader />}>
      <RouteContainer>
        <I18n>
          {({ i18n }) => (
            <WindowTitle title={i18n._(t("post_thread.title")`Post thread`)} />
          )}
        </I18n>
        <PostThreadForm categories={categories} />
      </RouteContainer>
    </Suspense>
  )
}

export default PostThread
