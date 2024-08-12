import { forwardRef } from "react";
import { VisualNovelBody, VisualNovelContainer } from "@/apps/website/components/containers/VisualNovelBox.tsx";
import { Profile as ProfileComponent } from "@/apps/website/components/Profile.tsx";

export const Profile = forwardRef<HTMLDivElement>(
  (_, ref) => {
    return (
      <VisualNovelContainer ref={ref}>
        <VisualNovelBody>
          <ProfileComponent />
        </VisualNovelBody>
      </VisualNovelContainer>
    );
  },
);
