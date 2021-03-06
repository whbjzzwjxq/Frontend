import {instance} from "@/api/main";

export interface TagRecommendation {
    [propName: string]: string[],
}

interface EmptyUserConcern {
    id: id,
    type: ConcernType,
    userConcern: null
}

export const userConcernQuery = (keyList: id[]) => {
    return instance.request<(UserConcernPayload | EmptyUserConcern)[]>(
        {

        }
    )
};
